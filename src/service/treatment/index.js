import { MEDICAL_RECORD_STATUS } from '../../common/common.constant';
import { BadRequestError, NotFoundError } from '../../core/error.response';
import db from '../../models';

class TreatmentService {
  /**
   * Get medical records by status
   * @param {string} status - Medical record status
   * @param {number} page - Current page
   * @param {number} limit - Number of records per page
   * @returns {Object} List of medical records by status
   */
  static async getRecordsByStatus({ status, page = 1, limit = 20 }) {
    const offset = (page - 1) * limit;

    if (!Object.values(MEDICAL_RECORD_STATUS).includes(status)) {
      throw new BadRequestError(`Invalid status: ${status}`);
    }

    const whereClause = status === 'all' ? {} : { status };

    const { rows: records, count } = await db.MedicalRecord.findAndCountAll({
      where: whereClause,
      include: [
        { model: db.Patient, as: 'Patient' },
        {
          model: db.Doctor,
          as: 'Doctor',
        },
      ],
      limit,
      offset,
      order: [['created_at', 'DESC']],
    });

    return {
      data: records,
      meta: {
        currentPage: page,
        itemsPerPage: limit,
        totalPages: Math.ceil(count / limit),
        totalItems: count,
      },
    };
  }

  /**
   * Get all medical records by patient ID
   * @param {number} patientId - ID of the patient
   * @param {number} page - Current page
   * @param {number} limit - Number of records per page
   * @returns {Object} List of medical records by patient ID
   */
  static async getRecordsByPatientId({ patientId, page = 1, limit = 20 }) {
    const offset = (page - 1) * limit;

    const { rows: records, count } = await db.MedicalRecord.findAndCountAll({
      where: { patient_id: patientId },
      include: [
        {
          model: db.Doctor,
          as: 'Doctor',
          include: [
            {
              model: db.Specialization,
              through: db.DoctorSpecialization,
            },
          ],
        },
        { model: db.Patient, as: 'Patient' },
      ],
      limit,
      offset,
      order: [['created_at', 'DESC']],
    });

    return {
      data: records,
      meta: {
        currentPage: page,
        itemsPerPage: limit,
        totalPages: Math.ceil(count / limit),
        totalItems: count,
      },
    };
  }

  /**
   * Chuyển trạng thái bệnh án (bước tiếp theo hoặc quay lại bác sĩ tiếp nhận)
   * @param {number} id - ID bệnh án
   * @param {boolean} revertToDoctor - Nếu true, quay lại trạng thái "doctor_received"
   * @returns {Object} Bệnh án sau khi cập nhật trạng thái
   */
  static async updateRecordStatus(id, revertToDoctor = false) {
    const record = await db.MedicalRecord.findByPk(id);
    if (!record) {
      throw new NotFoundError('Medical Record not found');
    }

    const currentStatus = record.status;

    // Nếu yêu cầu quay lại bác sĩ tiếp nhận
    if (revertToDoctor) {
      if (
        ![MEDICAL_RECORD_STATUS.WAITING_LAB, MEDICAL_RECORD_STATUS.WAITING_PAYMENT].includes(
          currentStatus
        )
      ) {
        throw new BadRequestError(
          `Cannot revert to "doctor_received" from status: ${currentStatus}`
        );
      }

      record.status = MEDICAL_RECORD_STATUS.DOCTOR_RECEIVED;
      await record.save();
      return record;
    }

    // Xác định trạng thái tiếp theo
    const nextStatus = {
      [MEDICAL_RECORD_STATUS.CREATED]: MEDICAL_RECORD_STATUS.REGISTERED,
      [MEDICAL_RECORD_STATUS.REGISTERED]: MEDICAL_RECORD_STATUS.NURSE_RECEIVED,
      [MEDICAL_RECORD_STATUS.NURSE_RECEIVED]: MEDICAL_RECORD_STATUS.DOCTOR_RECEIVED,
      [MEDICAL_RECORD_STATUS.DOCTOR_RECEIVED]: MEDICAL_RECORD_STATUS.WAITING_LAB,
      [MEDICAL_RECORD_STATUS.WAITING_LAB]: MEDICAL_RECORD_STATUS.WAITING_PAYMENT,
      [MEDICAL_RECORD_STATUS.WAITING_PAYMENT]: MEDICAL_RECORD_STATUS.COMPLETED,
    };

    if (!nextStatus[currentStatus]) {
      throw new BadRequestError(`Cannot move to the next status from ${currentStatus}`);
    }

    record.status = nextStatus[currentStatus];
    await record.save();
    return record;
  }

  /**
   * Tìm kiếm bệnh án theo từ khóa
   * @param {string} keyword - Từ khóa tìm kiếm (tên bệnh nhân, chẩn đoán, bác sĩ)
   * @param {number} page - Trang hiện tại
   * @param {number} limit - Số bản ghi trên mỗi trang
   * @returns {Object} Danh sách bệnh án phù hợp với từ khóa
   */
  static async searchRecords({ keyword, page = 1, limit = 20 }) {
    const offset = (page - 1) * limit;

    const { rows: records, count } = await db.MedicalRecord.findAndCountAll({
      where: {
        [db.Sequelize.Op.or]: [
          { diagnosis: { [db.Sequelize.Op.like]: `%${keyword}%` } },
          { '$Doctor.first_name$': { [db.Sequelize.Op.like]: `%${keyword}%` } },
          { '$Doctor.last_name$': { [db.Sequelize.Op.like]: `%${keyword}%` } },
          { '$Patient.full_name$': { [db.Sequelize.Op.like]: `%${keyword}%` } },
        ],
      },
      include: [
        {
          model: db.Doctor,
          as: 'Doctor',
          include: [
            {
              model: db.Specialization,
              through: db.DoctorSpecialization,
            },
          ],
        },
        { model: db.Patient, as: 'Patient' },
      ],
      limit,
      offset,
      order: [['created_at', 'DESC']],
    });

    return {
      data: records,
      meta: {
        currentPage: page,
        itemsPerPage: limit,
        totalPages: Math.ceil(count / limit),
        totalItems: count,
      },
    };
  }

  /**
   * Gửi lại kết quả xét nghiệm để bác sĩ tiếp nhận
   * @param {number} id - ID bệnh án
   * @returns {Object} Bệnh án đã cập nhật
   */
  static async resendToDoctor(id) {
    const record = await db.MedicalRecord.findByPk(id);
    if (!record) {
      throw new NotFoundError('Medical Record not found');
    }

    const currentStatus = record.status;

    if (currentStatus !== MEDICAL_RECORD_STATUS.WAITING_LAB) {
      throw new BadRequestError(`Cannot resend to doctor from status: ${currentStatus}`);
    }

    record.status = MEDICAL_RECORD_STATUS.DOCTOR_RECEIVED;
    await record.save();
    return record;
  }
  // NURSE
  /**
   * Y tá ghi chỉ số sinh tồn (vital signs) mới cho bệnh án
   * @param {number} medicalRecordId - ID bệnh án
   * @param {Object} vitalSignsData - Dữ liệu chỉ số sinh tồn
   * @returns {Object} Thông tin chỉ số sinh tồn vừa được tạo
   */
  static async addVitalSigns(medicalRecordId, vitalSignsData) {
    const { temperature, blood_pressure, heart_rate, respiratory_rate, weight, height, bmi, note } =
      vitalSignsData;

    // Kiểm tra bệnh án có tồn tại không
    const medicalRecord = await db.MedicalRecord.findByPk(medicalRecordId);
    if (!medicalRecord) {
      throw new NotFoundError('Medical Record not found');
    }

    // // Kiểm tra trạng thái bệnh án
    // if (medicalRecord.status !== 'nurse_received') {
    //   throw new BadRequestError('Cannot add vital signs unless the status is "nurse_received"');
    // }

    // Tạo mới một bản ghi chỉ số sinh tồn
    const newVitalSigns = await db.VitalSigns.create({
      medical_record_id: medicalRecordId,
      temperature,
      blood_pressure,
      heart_rate,
      respiratory_rate,
      weight,
      bmi,
      note,
      height,
      create_at: new Date(),
      update_at: new Date(),
    });

    return newVitalSigns;
  }

  /**
   * Lấy danh sách tất cả chỉ số sinh tồn của một bệnh án
   * @param {number} medicalRecordId - ID bệnh án
   * @returns {Array} Danh sách các chỉ số sinh tồn
   */
  static async getVitalSigns(medicalRecordId) {
    // Kiểm tra bệnh án có tồn tại không
    const medicalRecord = await db.MedicalRecord.findByPk(medicalRecordId);
    if (!medicalRecord) {
      throw new NotFoundError('Medical Record not found');
    }

    // Lấy danh sách chỉ số sinh tồn
    const vitalSigns = await db.VitalSigns.findAll({
      where: { medical_record_id: medicalRecordId },
      include: [{ model: db.MedicalRecord, as: 'MedicalRecord' }],
      order: [['create_at', 'DESC']],
    });

    return vitalSigns;
  }

  /**
   * Lấy tất cả chỉ số sinh tồn của một bệnh nhân
   * @param {number} patientId - ID của bệnh nhân
   * @returns {Array} Danh sách các chỉ số sinh tồn của bệnh nhân
   */
  static async getAllVitalSignsByPatientId(patientId) {
    const patient = await db.Patient.findByPk(patientId);
    if (!patient) {
      throw new NotFoundError('Patient not found');
    }

    const vitalSigns = await db.VitalSigns.findAll({
      include: [
        {
          model: db.MedicalRecord,
          as: 'MedicalRecord',
          where: { patient_id: patientId },
        },
      ],
      order: [['create_at', 'DESC']],
    });

    return vitalSigns;
  }

  /**
   * Bác sĩ chuẩn đoán bệnh cho bệnh nhân
   * @param {number} medicalRecordId - ID của bệnh án
   * @param {Object} diagnosisData - Dữ liệu chẩn đoán
   * @returns {Object} Cập nhật thành công bệnh án
   */
  static async addDiagnosis(medicalRecordId, diagnosisData) {
    const { diagnosis, symptoms, treatment_plan, status } = diagnosisData;

    // Tìm bệnh án
    const medicalRecord = await db.MedicalRecord.findByPk(medicalRecordId);
    if (!medicalRecord) {
      throw new NotFoundError('Medical Record not found');
    }

    // Kiểm tra trạng thái bệnh án
    if (medicalRecord.status !== 'doctor_received') {
      throw new BadRequestError('Cannot add diagnosis unless the status is "doctor_received"');
    }

    // Cập nhật thông tin chẩn đoán
    medicalRecord.diagnosis = diagnosis || medicalRecord.diagnosis;
    medicalRecord.symptoms = symptoms || medicalRecord.symptoms;
    medicalRecord.treatment_plan = treatment_plan || medicalRecord.treatment_plan;

    // Chuyển trạng thái nếu cần
    if (status && status === 'waiting_lab') {
      medicalRecord.status = 'waiting_lab';
    } else if (status && status === 'waiting_payment') {
      medicalRecord.status = 'waiting_payment';
    }

    await medicalRecord.save();

    return medicalRecord;
  }

  /**
   * Xóa chỉ số sinh tồn theo ID
   * @param {number} vitalSignId - ID của chỉ số sinh tồn
   * @returns {Object} Thông tin chỉ số sinh tồn đã bị xóa
   */
  static async deleteVitalSign(vitalSignId) {
    const vitalSign = await db.VitalSigns.findByPk(vitalSignId);
    if (!vitalSign) {
      throw new NotFoundError('Vital Sign not found');
    }

    await vitalSign.destroy();
    return vitalSign;
  }
}

export default TreatmentService;
