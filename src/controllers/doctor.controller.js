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

  getAllAvailabilities = async (req, res, next) => {
    new SuccessResponse({
      metadata: await doctorService.getAllAvailabilities(req.params.doctor_id),
    }).send(res);
  };

  getAvailabilityById = async (req, res, next) => {
    new SuccessResponse({
      metadata: await doctorService.getAvailabilityById(req.params.id),
    }).send(res);
  };

  addAvailability = async (req, res, next) => {
    new SuccessResponse({
      metadata: await doctorService.addAvailability(req.body),
    }).send(res);
  };

  updateAvailability = async (req, res, next) => {
    new SuccessResponse({
      metadata: await doctorService.updateAvailability(req.params.id, req.body),
    }).send(res);
  };

  deleteAvailability = async (req, res, next) => {
    new SuccessResponse({
      metadata: await doctorService.deleteAvailability(req.params.id),
    }).send(res);
  };

  getAvailabilitiesBetween = async (req, res, next) => {
    const { start_time, end_time } = req.query;
    const { doctor_id } = req.params;
    new SuccessResponse({
      metadata: await doctorService.getAvailabilitiesBetween(doctor_id, start_time, end_time),
    }).send(res);
  };
}

export default new DoctorController();
