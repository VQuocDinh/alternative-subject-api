import { SuccessResponse } from '../core/success.response.js';
import patientService from '../service/patient.js';

class PatientController {
  getAll = async (req, res, next) => {
    new SuccessResponse({
      message: 'All patients',
      metadata: await patientService.getAll(req.query),
    }).send(res);
  };

  getByFace = async (req, res, next) => {
    new SuccessResponse({
      metadata: await patientService.getByFace(req.body.image),
    }).send(res);
  };

  findByPk = async (req, res, next) => {
    new SuccessResponse({
      metadata: await patientService.findByPk(req.params.id),
    }).send(res);
  };

  searchPatient = async (req, res, next) => {
    new SuccessResponse({
      metadata: await patientService.searchPatient(req.body.cccd),
    }).send(res);
  };

  deletePatient = async (req, res, next) => {
    new SuccessResponse({
      metadata: await patientService.deletePatient(req.body.id),
    }).send(res);
  };

  addPatient = async (req, res, next) => {
    new SuccessResponse({
      metadata: await patientService.addPatient(req.body),
    }).send(res);
  };

  editPatient = async (req, res, next) => {
    new SuccessResponse({
      metadata: await patientService.editPatient(req.body),
    }).send(res);
  };
}

export default new PatientController();
