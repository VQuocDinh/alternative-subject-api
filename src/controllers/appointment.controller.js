import { SuccessResponse } from '../core/success.response';
import AppointmentService from '../service/appointment.service';

class AppointmentController {
  async getAllAppointments(req, res, next) {
    const { page, limit } = req.query;
    const result = await AppointmentService.getAllAppointments({ page, limit });
    new SuccessResponse({
      message: 'Appointments retrieved successfully',
      metadata: result,
    }).send(res);
  }

  async getAppointmentById(req, res, next) {
    const { id } = req.params;
    const result = await AppointmentService.getAppointmentById(id);
    new SuccessResponse({
      message: 'Appointment retrieved successfully',
      metadata: result,
    }).send(res);
  }

  async addAppointment(req, res, next) {
    const appointmentData = req.body;
    const result = await AppointmentService.addAppointment(appointmentData);
    new SuccessResponse({
      message: 'Appointment added successfully',
      metadata: result,
    }).send(res);
  }

  async updateAppointment(req, res, next) {
    const { id } = req.params;
    const appointmentData = req.body;
    const result = await AppointmentService.updateAppointment(id, appointmentData);
    new SuccessResponse({
      message: 'Appointment updated successfully',
      metadata: result,
    }).send(res);
  }

  async deleteAppointment(req, res, next) {
    const { id } = req.params;
    const result = await AppointmentService.deleteAppointment(id);
    new SuccessResponse({
      message: 'Appointment deleted successfully',
      metadata: result,
    }).send(res);
  }

  async getAppointmentsByDoctorAndDate(req, res, next) {
    const { doctorId } = req.params;
    const { date } = req.query;
    const result = await AppointmentService.getAppointmentsByDoctorAndDate(doctorId, date);
    new SuccessResponse({
      message: 'Appointments retrieved successfully',
      metadata: result,
    }).send(res);
  }

  async getAppointmentsByPatient(req, res, next) {
    const { patient_id, page, limit } = req.query;
    const result = await AppointmentService.getAppointmentsByPatient(patient_id, { page, limit });
    new SuccessResponse({
      message: 'Appointments retrieved successfully',
      metadata: result,
    }).send(res);
  }

  async getAppointmentsByDoctorBetweenDates(req, res, next) {
    const { doctor_id, start_date, end_date } = req.query;
    const result = await AppointmentService.getAppointmentsByDoctorBetweenDates(
      doctor_id,
      start_date,
      end_date
    );
    new SuccessResponse({
      message: 'Appointments retrieved successfully',
      metadata: result,
    }).send(res);
  }
}

export default new AppointmentController();
