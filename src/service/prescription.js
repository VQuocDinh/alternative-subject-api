import { where } from 'sequelize';
import { BadRequestError, NotFoundError } from '../core/error.response';
import db from '../models';

class PrescriptionService {
  /**
   * Get all prescriptions by patient ID
   * @param {number} patientId - Patient ID
   * @returns {Array} List of prescriptions
   * @throws {NotFoundError} If no prescriptions are found
   */
  static async getPrescriptionByPatient(patientId) {
    const medicalRecords = await db.MedicalRecord.findAll({
      where: { patient_id: patientId },
      attributes: ['id'],
    });

    if (!medicalRecords.length) {
      throw new NotFoundError('No medical records found for the given patient ID');
    }

    const medicalRecordIds = medicalRecords.map((record) => record.id);

    const prescriptions = await db.Prescription.findAll({
      where: { medical_record_id: medicalRecordIds },
      include: [
        {
          model: db.Medicine,
          as: 'Medicines',
        },
        {
          model: db.Doctor,
          as: 'Doctor',
        },
        {
          model: db.MedicalRecord,
          as: 'MedicalRecord',
          include: [{ model: db.Patient, as: 'Patient' }],
        },
      ],
    });

    if (!prescriptions?.length) {
      throw new NotFoundError('No prescriptions found for the given patient ID');
    }

    return prescriptions;
  }

  /**
   * Get a specific prescription by ID
   * @param {number} id - Prescription ID
   * @returns {Object} Prescription details
   * @throws {NotFoundError} If the prescription is not found
   */
 static async getPrescriptionById(id) {
  const prescription = await db.Prescription.findByPk(id, {
    include: [
      {
        model: db.PrescriptionMedicine,
        as: 'PrescriptionMedicines',  
        include: [{ model: db.Medicine,
          as: 'Medicine',
         }],
      },
      {
        model: db.Doctor,
        as: 'Doctor',
        include: [
          {
            model: db.Specialization,
          },
        ],
      },
      {
        model: db.MedicalRecord,
        as: 'MedicalRecord',
        include: [{ model: db.Patient, as: 'Patient' }],
      },
    ],
  });

  if (!prescription) {
    throw new NotFoundError('Prescription not found');
  }

  return prescription;
}

  /**
   * Add a new prescription
   * @param {Object} prescriptionData - Prescription data
   * @returns {Object} New prescription
   * @throws {BadRequestError} If required fields are missing
   */
  static async addPrescription(prescriptionData) {
    const { medical_record_id, doctor_id, notes, medicines } = prescriptionData;

    // Validate input data
    if (!doctor_id || !medical_record_id) {
      throw new BadRequestError('Doctor Id and Medical Id are required');
    }

    const prescription = await db.Prescription.create({
      medical_record_id,
      doctor_id,
      notes,
    });

    // Create prescription medicines
    if (medicines && medicines.length > 0) {
      const prescriptionMedicines = medicines.map((medicine) => ({
        prescription_id: prescription.id,
        medicine_id: medicine.id,
        quantity: medicine.quantity,
        dosage: medicine.dosage,
        frequency: medicine.frequency,
        duration: medicine.duration,
        instructions: medicine.instructions,
      }));

      const createdPrescriptionMedicines = await db.PrescriptionMedicine.bulkCreate(prescriptionMedicines);
      
      // Tạo lịch cho từng thuốc
      for (const prescriptionMedicine of createdPrescriptionMedicines) {
          await createMedicationSchedules(prescriptionMedicine);
      }
    }

    return prescription;
  }

  /**
   * Delete a prescription by ID
   * @param {number} id - Prescription ID
   * @returns {string} Deletion success message
   * @throws {NotFoundError} If the prescription is not found
   */
  static async deletePrescription(id) {
    const prescription = await db.Prescription.findByPk(id);
    if (!prescription) {
      throw new NotFoundError('Prescription not found');
    }

    await prescription.destroy();
    return 'Prescription deleted successfully';
  }

  /**
   * Count the number of each status in prescriptions
   * @returns {Object} Count of each status
   */
  static async countPrescriptionStatuses() {
    const statuses = await db.Prescription.findAll({
      attributes: ['status', [db.Sequelize.fn('COUNT', db.Sequelize.col('status')), 'count']],
      group: ['status'],
    });

    return statuses.reduce((acc, status) => {
      acc[status.status] = status.dataValues.count;
      return acc;
    }, {});
  }
}

const createMedicationSchedules = async (prescriptionMedicine) => {
  try {
      const startDate = new Date(prescriptionMedicine.start_date);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + parseInt(prescriptionMedicine.duration));

      const timeSlots = {
          '1 lần/ngày': ['07:30'],
          '2 lần/ngày': ['07:30', '19:30'],
          '3 lần/ngày': ['07:30', '12:30', '19:30'],
          '4 lần/ngày': ['06:00', '12:00', '18:00', '22:00'],
      };

      // Kiểm tra frequency có hợp lệ không
      if (!timeSlots[prescriptionMedicine.frequency]) {
          throw new Error(`Invalid frequency: ${prescriptionMedicine.frequency}`);
      }

      const schedules = [];
      const times = timeSlots[prescriptionMedicine.frequency];

      // Clone startDate để không ảnh hưởng đến giá trị gốc
      let currentDate = new Date(startDate);

      // Lặp qua từng ngày từ startDate đến endDate
      while (currentDate <= endDate) {
          times.forEach((time) => {
              const [hour, minute] = time.split(':');
              const scheduleTime = new Date(currentDate);
              scheduleTime.setHours(parseInt(hour), parseInt(minute), 0, 0);

              schedules.push({
                  prescription_medicine_id: prescriptionMedicine.id,
                  schedule_time: scheduleTime,
                  status: 'pending',
                  reminder_enabled: true,
              });
          });

          // Tăng currentDate lên 1 ngày
          currentDate.setDate(currentDate.getDate() + 1);
      }

      return await db.MedicationSchedule.bulkCreate(schedules);
  } catch (error) {
      console.error('Error creating medication schedules:', error);
      throw error;
  }
};

export default PrescriptionService;
