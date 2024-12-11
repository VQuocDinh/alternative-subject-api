import { SuccessResponse } from '../core/success.response.js';
import doctorService from '../service/doctor';

class DoctorController {
  getAllDoctors = async (req, res, next) => {
    new SuccessResponse({
      metadata: await doctorService.getAllDoctors(req.query),
    }).send(res);
  };

  getDoctorById = async (req, res, next) => {
    new SuccessResponse({
      metadata: await doctorService.getDoctorById(req.params.id),
    }).send(res);
  };

  addDoctor = async (req, res, next) => {
    new SuccessResponse({
      metadata: await doctorService.addDoctor(req.body),
    }).send(res);
  };

  updateDoctor = async (req, res, next) => {
    new SuccessResponse({
      metadata: await doctorService.updateDoctor(req.params.id, req.body),
    }).send(res);
  };

  deleteDoctor = async (req, res, next) => {
    new SuccessResponse({
      metadata: await doctorService.deleteDoctor(req.params.id),
    }).send(res);
  };

  getDoctorBySpecialization = async (req, res, next) => {
    new SuccessResponse({
      metadata: await doctorService.getDoctorBySpecialization(req.params.specialization_id),
    }).send(res);
  };
}

export default new DoctorController();
