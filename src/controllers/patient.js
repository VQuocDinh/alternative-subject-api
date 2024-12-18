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

  searchPatientByNameAndEmail = async (req, res, next) => {
    new SuccessResponse({
      metadata: await patientService.searchPatientByNameAndEmail({
        name: req.body.full_name,
        email: req.body.email,
        page: req.body.page,
        limit: req.body.limit,
      }),
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
      metadata: await patientService.editPatient(req.params.id, req.body),
    }).send(res);
  };

  getAppointmentsByPatientId = async (req, res, next) => {
    new SuccessResponse({
      metadata: await patientService.getAppointmentsByPatientId(
        req.params.id,
        req.query.startTime,
        req.query.endTime
      ),
    }).send(res);
  };
}

export default new PatientController();
