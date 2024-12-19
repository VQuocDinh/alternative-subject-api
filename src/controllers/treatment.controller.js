import { SuccessResponse } from '../core/success.response';
import TreatmentService from '../service/treatment';

class TreatmentController {
  /**
   * Lấy danh sách bệnh án theo trạng thái
   */
  getRecordsByStatus = async (req, res, next) => {
    const { status } = req.query;
    const { page, limit } = req.query;

    new SuccessResponse({
      metadata: await TreatmentService.getRecordsByStatus({
        status,
        page: parseInt(page, 10) || 1,
        limit: parseInt(limit, 10) || 20,
      }),
    }).send(res);
  };

  /**
   * Chuyển trạng thái bệnh án
   */
  updateRecordStatus = async (req, res, next) => {
    const { id } = req.params;
    const { revertToDoctor } = req.body; // true nếu quay lại trạng thái "doctor_received"

    new SuccessResponse({
      metadata: await TreatmentService.updateRecordStatus(id, revertToDoctor),
    }).send(res);
  };

  /**
   * Tìm kiếm bệnh án theo từ khóa
   */
  searchRecords = async (req, res, next) => {
    const { keyword } = req.query;
    const { page, limit } = req.query;

    new SuccessResponse({
      metadata: await TreatmentService.searchRecords({
        keyword,
        page: parseInt(page, 10) || 1,
        limit: parseInt(limit, 10) || 20,
      }),
    }).send(res);
  };

  /**
   * Gửi lại kết quả xét nghiệm để bác sĩ tiếp nhận
   */
  resendToDoctor = async (req, res, next) => {
    const { id } = req.params;

    new SuccessResponse({
      metadata: await TreatmentService.resendToDoctor(id),
    }).send(res);
  };
  /**
   * Y tá ghi chỉ số sinh tồn (Vital Signs)
   */
  addVitalSigns = async (req, res, next) => {
    const { id: medicalRecordId } = req.params; // ID bệnh án
    const vitalSignsData = req.body; // Dữ liệu chỉ số sinh tồn từ body request

    new SuccessResponse({
      metadata: await TreatmentService.addVitalSigns(medicalRecordId, vitalSignsData),
    }).send(res);
  };
  /**
   * Lấy danh sách chỉ số sinh tồn (Vital Signs) của bệnh án
   */
  getVitalSigns = async (req, res, next) => {
    const { id: medicalRecordId } = req.params; // ID bệnh án

    new SuccessResponse({
      metadata: await TreatmentService.getVitalSigns(medicalRecordId),
    }).send(res);
  };
  /**
   * Xóa chỉ số sinh tồn theo ID
   */
  deleteVitalSign = async (req, res, next) => {
    const { id: vitalSignId } = req.params;

    new SuccessResponse({
      metadata: await TreatmentService.deleteVitalSign(vitalSignId),
    }).send(res);
  };
  /**
   * Bác sĩ thêm chẩn đoán cho bệnh án
   */
  addDiagnosis = async (req, res, next) => {
    const { id: medicalRecordId } = req.params;
    const diagnosisData = req.body;

    new SuccessResponse({
      metadata: await TreatmentService.addDiagnosis(medicalRecordId, diagnosisData),
    }).send(res);
  };

  /**
   * Lấy danh sách bệnh án theo ID bệnh nhân
   */
  getRecordsByPatientId = async (req, res, next) => {
    const { patientId } = req.params;
    const { page, limit } = req.query;

    new SuccessResponse({
      metadata: await TreatmentService.getRecordsByPatientId({
        patientId: parseInt(patientId, 10),
        page: parseInt(page, 10) || 1,
        limit: parseInt(limit, 10) || 20,
      }),
    }).send(res);
  };

  /**
   * Lấy tất cả chỉ số sinh tồn của một bệnh nhân
   */
  getAllVitalSignsByPatientId = async (req, res, next) => {
    const { patientId } = req.params;

    new SuccessResponse({
      metadata: await TreatmentService.getAllVitalSignsByPatientId(patientId),
    }).send(res);
  };
}

export default new TreatmentController();
