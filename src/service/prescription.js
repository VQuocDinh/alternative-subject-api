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
          as: 'Medicine',
        },
        {
          model: db.Doctor,
          as: 'Doctor',
          attributes: [],
        },
        {
          model: db.MedicalRecord,
          as: 'MedicalRecord',
          include: [{ model: db.Patient, as: 'Patient' }],
        },
      ],
      attributes: [],
    });

    if (!prescriptions.length) {
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
          model: db.Medicine,
          as: 'Medicine',
        },
        {
          model: db.Doctor,
          as: 'Doctor',
        },
        {
          model: db.MedicalRecord,
          as: 'MedicalRecord',
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
    const { medical_record_id, doctor_id, prescribed_at, status } = prescriptionData;

    // Validate input data
    if (!doctor_id || !prescribed_at || !status) {
      throw new BadRequestError('Doctor ID, prescribed date, and status are required');
    }

    const newPrescription = await db.Prescription.create(prescriptionData, {
      include: [
        {
          model: db.PrescriptionMedicine,
          as: 'PrescriptionMedicine',
        },
      ],
    });

    return newPrescription;
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

export default PrescriptionService;
