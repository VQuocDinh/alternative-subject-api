import { BadRequestError, NotFoundError } from '../../core/error.response';
import db from '../../models';

class MedicalRecordService {
  /**
   * Get all medical records with pagination and sorting
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @returns {Object} Paginated medical records
   */
  static async getAllMedicalRecords({ page = 1, limit = 20 }) {
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { rows: medicalRecords, count } = await db.MedicalRecord.findAndCountAll({
      attributes: ['id', 'diagnosis', 'status', 'created_at'],
      include: [
        { model: db.Doctor, as: 'Doctor', attributes: ['first_name', 'last_name'] },
        { model: db.Patient, as: 'Patient', attributes: ['full_name'] },
      ],
      offset,
      limit: parseInt(limit),
      order: [['created_at', 'DESC']],
    });

    return {
      data: medicalRecords,
      meta: {
        currentPage: parseInt(page),
        itemsPerPage: parseInt(limit),
        totalPages: Math.ceil(count / parseInt(limit)),
        totalItems: count,
      },
    };
  }

  /**
   * Get a single medical record by ID
   * @param {number} id - Medical record ID
   * @returns {Object} Medical record
   * @throws {NotFoundError} If the medical record is not found
   */
  static async getMedicalRecordById(id) {
    const medicalRecord = await db.MedicalRecord.findByPk(id, {
      include: [
        { model: db.Doctor, as: 'Doctor', attributes: ['id', 'first_name', 'last_name'] },
        { model: db.Patient, as: 'Patient', attributes: ['id', 'full_name'] },
        { model: db.VitalSigns, as: 'VitalSigns', attributes: ['temperature', 'blood_pressure'] },
      ],
    });

    if (!medicalRecord) {
      throw new NotFoundError('Medical Record not found');
    }

    return medicalRecord;
  }

  /**
   * Add a new medical record
   * @param {Object} data - Medical record data
   * @returns {Object} New medical record
   * @throws {BadRequestError} If required fields are missing
   */
  static async addNewMedicalRecord(data) {
    const { patient_id, doctor_id, diagnosis, symptoms, treatment_plan, status } = data;

    // Validate input data
    if (!diagnosis || !patient_id || !doctor_id) {
      throw new BadRequestError('Diagnosis, Patient ID, and Doctor ID are required');
    }

    const newRecord = await db.MedicalRecord.create({
      patient_id,
      doctor_id,
      diagnosis,
      symptoms,
      treatment_plan,
      status: status || 'in_treatment',
    });

    return newRecord;
  }

  /**
   * Change the status of a medical record
   * @param {number} id - Medical record ID
   * @param {string} status - New status
   * @returns {Object} Updated medical record
   * @throws {NotFoundError} If the medical record is not found
   * @throws {BadRequestError} If the status is invalid
   */
  static async changeStatusMedicalRecord(id, status) {
    if (!['in_treatment', 'completed', 'cancelled'].includes(status)) {
      throw new BadRequestError('Invalid status value');
    }

    const medicalRecord = await db.MedicalRecord.findByPk(id);
    if (!medicalRecord) {
      throw new NotFoundError('Medical Record not found');
    }

    medicalRecord.status = status;
    await medicalRecord.save();

    return medicalRecord;
  }

  /**
   * Delete a medical record by ID
   * @param {number} id - Medical record ID
   * @returns {string} Deletion success message
   * @throws {NotFoundError} If the medical record is not found
   */
  static async deleteMedicalRecord(id) {
    const medicalRecord = await db.MedicalRecord.findByPk(id);
    if (!medicalRecord) {
      throw new NotFoundError('Medical Record not found');
    }

    await medicalRecord.destroy();
    return 'Medical Record deleted successfully';
  }
}

export default MedicalRecordService;
