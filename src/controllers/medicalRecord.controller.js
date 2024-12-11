import { SuccessResponse } from '../core/success.response.js';
import MedicalRecordService from './../service/treatment/medicalRecord.service.js';

class MedicalRecordController {
  getMedicalRecordById = async (req, res, next) => {
    new SuccessResponse({
      metadata: await MedicalRecordService.getMedicalRecordById(req.params.id),
    }).send(res);
  };
  addMedicalRecords = async (req, res, nex) => {
    new SuccessResponse({
      metadata: await MedicalRecordService.addNewMedicalRecord(req.body),
    }).send(res);
  };
  changeStatusMedicalRecord = async (req, res, nex) => {
    new SuccessResponse({
      metadata: await MedicalRecordService.changeStatusMedicalRecord(
        req.params.id,
        req.body.status
      ),
    }).send(res);
  };
  getAllMedicalRecords = async (req, res, next) => {
    new SuccessResponse({
      metadata: await MedicalRecordService.getAllMedicalRecords(req.query),
    }).send(res);
  };

  countMedicalRecordStatuses = async (req, res, next) => {
    new SuccessResponse({
      metadata: await MedicalRecordService.countMedicalRecordStatuses(),
    }).send(res);
  };
}

export default new MedicalRecordController();
