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
      include: [
        { model: db.Doctor, as: 'Doctor' },
        { model: db.Patient, as: 'Patient' },
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
        { model: db.Doctor, as: 'Doctor' },
        { model: db.Patient, as: 'Patient' },
        { model: db.VitalSigns, as: 'VitalSigns' },
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
    if (!patient_id || !doctor_id) {
      throw new BadRequestError(' Patient ID, and Doctor ID are required');
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

  /**
   * Count the number of each status in medical records
   * @returns {Object} Count of each status
   */
  static async countMedicalRecordStatuses() {
    const statuses = await db.MedicalRecord.findAll({
      attributes: ['status', [db.Sequelize.fn('COUNT', db.Sequelize.col('status')), 'count']],
      group: ['status'],
    });

    return statuses.reduce((acc, status) => {
      acc[status.status] = status.dataValues.count;
      return acc;
    }, {});
  }

  /**
   * Get all diagnoses with pagination and sorting
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @returns {Object} Paginated diagnoses
   */
  static async getAllDiagnoses({ page = 1, limit = 20 }) {
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { rows: diagnoses, count } = await db.Diagnosis.findAndCountAll({
      offset,
      limit: parseInt(limit),
      order: [['taken_time', 'DESC']],
    });

    return {
      data: diagnoses,
      meta: {
        currentPage: parseInt(page),
        itemsPerPage: parseInt(limit),
        totalPages: Math.ceil(count / parseInt(limit)),
        totalItems: count,
      },
    };
  }

  /**
   * Get a single diagnosis by ID and medical record ID
   * @param {number} medicalRecordId - Medical record ID
   * @param {number} diagnosisId - Diagnosis ID
   * @returns {Object} Diagnosis
   * @throws {NotFoundError} If the diagnosis is not found
   */
  static async getDiagnosisById(medicalRecordId, diagnosisId) {
    const diagnosis = await db.Diagnosis.findOne({
      where: { id: diagnosisId, medical_record_id: medicalRecordId },
      include: [{ model: db.Disease, as: 'Disease' }],
    });

    if (!diagnosis) {
      throw new NotFoundError('Diagnosis not found');
    }

    return diagnosis;
  }

  /**
   * Add a new diagnosis to a specific medical record
   * @param {number} medicalRecordId - Medical record ID
   * @param {Object} data - Diagnosis data
   * @returns {Object} New diagnosis
   * @throws {BadRequestError} If required fields are missing
   */
  static async addNewDiagnosis(medicalRecordId, data) {
    const { doctor_id, disease_name, icd10_code, treatment_plan, symptoms, taken_time, note } =
      data;

    // Validate input data
    if (!doctor_id || !disease_name || !icd10_code || !treatment_plan || !symptoms || !taken_time) {
      throw new BadRequestError('All fields except note are required');
    }

    const newDiagnosis = await db.Diagnosis.create(
      {
        doctor_id,
        medical_record_id: medicalRecordId,
        disease_name,
        icd10_code,
        treatment_plan,
        symptoms,
        taken_time,
        note,
      },
      {
        include: [{ model: db.Disease, as: 'Disease' }],
      }
    );

    return newDiagnosis;
  }

  /**
   * Edit an existing diagnosis for a specific medical record
   * @param {number} medicalRecordId - Medical record ID
   * @param {number} diagnosisId - Diagnosis ID
   * @param {Object} data - Updated diagnosis data
   * @returns {Object} Updated diagnosis
   * @throws {NotFoundError} If the diagnosis is not found
   */
  static async editDiagnosis(medicalRecordId, diagnosisId, data) {
    const diagnosis = await db.Diagnosis.findOne({
      where: { id: diagnosisId, medical_record_id: medicalRecordId },
    });

    if (!diagnosis) {
      throw new NotFoundError('Diagnosis not found');
    }

    await diagnosis.update(data);

    return diagnosis;
  }

  /**
   * Delete a diagnosis by ID and medical record ID
   * @param {number} medicalRecordId - Medical record ID
   * @param {number} diagnosisId - Diagnosis ID
   * @returns {string} Deletion success message
   * @throws {NotFoundError} If the diagnosis is not found
   */
  static async deleteDiagnosis(medicalRecordId, diagnosisId) {
    const diagnosis = await db.Diagnosis.findOne({
      where: { id: diagnosisId, medical_record_id: medicalRecordId },
    });

    if (!diagnosis) {
      throw new NotFoundError('Diagnosis not found');
    }

    await diagnosis.destroy();
    return 'Diagnosis deleted successfully';
  }

  /**
   * Get all diagnoses by medical record ID with pagination and sorting
   * @param {number} medicalRecordId - Medical record ID
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @returns {Object} Paginated diagnoses
   * @throws {NotFoundError} If the medical record is not found
   */
  static async getAllDiagnosesByMedicalRecord(medicalRecordId, { page = 1, limit = 20 }) {
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const medicalRecord = await db.MedicalRecord.findByPk(medicalRecordId, {
      include: [
        {
          model: db.Diagnosis,
          as: 'Diagnoses',
          offset,
          limit: parseInt(limit),
          order: [['taken_time', 'DESC']],
        },
      ],
    });

    if (!medicalRecord) {
      throw new NotFoundError('Medical Record not found');
    }

    const {
      Diagnoses: diagnoses,
      Diagnoses: { length: count },
    } = medicalRecord;

    return {
      data: diagnoses,
      meta: {
        currentPage: parseInt(page),
        itemsPerPage: parseInt(limit),
        totalPages: Math.ceil(count / parseInt(limit)),
        totalItems: count,
      },
    };
  }
}

export default MedicalRecordService;
