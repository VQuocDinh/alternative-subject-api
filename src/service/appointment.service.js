import { BadRequestError, NotFoundError } from '../core/error.response';
import db from '../models';

class AppointmentService {
  /**
   * Get all appointments with pagination
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @returns {Object} Paginated appointments
   */
  static async getAllAppointments({ page = 1, limit = 20 }) {
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { rows: appointments, count } = await db.Appointment.findAndCountAll({
      offset,
      limit: parseInt(limit),
      order: [['create_time', 'DESC']],
    });

    return {
      data: appointments,
      meta: {
        currentPage: parseInt(page),
        itemsPerPage: parseInt(limit),
        totalPages: Math.ceil(count / parseInt(limit)),
        totalItems: count,
      },
    };
  }

  /**
   * Get a single appointment by ID
   * @param {number} id - Appointment ID
   * @returns {Object} Appointment
   * @throws {NotFoundError} If the appointment is not found
   */
  static async getAppointmentById(id) {
    const appointment = await db.Appointment.findByPk(id);
    if (!appointment) {
      throw new NotFoundError('Appointment not found');
    }
    return appointment;
  }

  /**
   * Add a new appointment
   * @param {Object} appointmentData - Appointment data
   * @returns {Object} New appointment
   * @throws {BadRequestError} If required fields are missing or if there is a conflict with existing appointments
   */
  static async addAppointment(appointmentData) {
    const { patient_id, doctor_id, appointment_taken_date, actual_start_time } = appointmentData;

    // Validate input data
    if (!patient_id || !doctor_id || !appointment_taken_date || !actual_start_time) {
      throw new BadRequestError(
        'Patient ID, Doctor ID, Appointment Taken Date, and Actual Start Time are required'
      );
    }

    // Calculate the end time assuming each appointment takes 30 minutes
    const actual_end_time = new Date(new Date(actual_start_time).getTime() + 30 * 60000);

    // Check for overlapping appointments
    const overlappingAppointments = await db.Appointment.findAll({
      where: {
        doctor_id,
        appointment_taken_date: {
          [db.Sequelize.Op.eq]: new Date(appointment_taken_date),
        },
        [db.Sequelize.Op.or]: [
          {
            actual_start_time: {
              [db.Sequelize.Op.between]: [actual_start_time, actual_end_time],
            },
          },
          {
            actual_end_time: {
              [db.Sequelize.Op.between]: [actual_start_time, actual_end_time],
            },
          },
          {
            [db.Sequelize.Op.and]: [
              {
                actual_start_time: {
                  [db.Sequelize.Op.lte]: actual_start_time,
                },
              },
              {
                actual_end_time: {
                  [db.Sequelize.Op.gte]: actual_end_time,
                },
              },
            ],
          },
        ],
      },
    });

    if (overlappingAppointments.length > 0) {
      throw new BadRequestError('Appointment overlaps with existing appointments');
    }

    const newAppointment = await db.Appointment.create({
      ...appointmentData,
      actual_end_time,
    });
    return newAppointment;
  }

  /**
   * Update an appointment
   * @param {number} id - Appointment ID
   * @param {Object} appointmentData - Appointment data
   * @returns {Object} Updated appointment
   * @throws {NotFoundError} If the appointment is not found
   */
  static async updateAppointment(id, appointmentData) {
    const appointment = await db.Appointment.findByPk(id);
    if (!appointment) {
      throw new NotFoundError('Appointment not found');
    }

    await appointment.update(appointmentData);
    return appointment;
  }

  /**
   * Delete an appointment by ID
   * @param {number} id - Appointment ID
   * @returns {string} Deletion success message
   * @throws {NotFoundError} If the appointment is not found
   */
  static async deleteAppointment(id) {
    const appointment = await db.Appointment.findByPk(id);
    if (!appointment) {
      throw new NotFoundError('Appointment not found');
    }

    await appointment.destroy();
    return 'Appointment deleted successfully';
  }

  /**
   * Get all appointments for a specific doctor on a specific day
   * @param {number} doctor_id - Doctor ID
   * @param {string} date - Specific date (YYYY-MM-DD)
   * @returns {Array} List of appointments
   */
  static async getAppointmentsByDoctorAndDate(doctor_id, date) {
    console.log('start');
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    console.log('query', startOfDay, endOfDay);

    const appointments = await db.Appointment.findAll({
      where: {
        doctor_id,
        appointment_taken_date: {
          [db.Sequelize.Op.between]: [startOfDay, endOfDay],
        },
      },
      order: [['appointment_taken_date', 'ASC']],
    });

    return appointments;
  }

  /**
   * Get all appointments for a specific doctor between two dates
   * @param {number} doctor_id - Doctor ID
   * @param {string} start_date - Start date (YYYY-MM-DD)
   * @param {string} end_date - End date (YYYY-MM-DD)
   * @returns {Array} List of appointments
   */
  static async getAppointmentsByDoctorBetweenDates(doctor_id, start_date, end_date) {
    const appointments = await db.Appointment.findAll({
      where: {
        doctor_id,
        appointment_taken_date: {
          [db.Sequelize.Op.between]: [new Date(start_date), new Date(end_date)],
        },
      },
      order: [['appointment_taken_date', 'ASC']],
    });

    return appointments;
  }

  /**
   * Get all appointments for a specific patient with pagination
   * @param {number} patient_id - Patient ID
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @returns {Object} Paginated appointments
   */
  static async getAppointmentsByPatient(patient_id, { page = 1, limit = 20 }) {
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { rows: appointments, count } = await db.Appointment.findAndCountAll({
      where: {
        patient_id,
      },
      offset,
      limit: parseInt(limit),
      order: [['appointment_taken_date', 'ASC']],
    });

    return {
      data: appointments,
      meta: {
        currentPage: parseInt(page),
        itemsPerPage: parseInt(limit),
        totalPages: Math.ceil(count / parseInt(limit)),
        totalItems: count,
      },
    };
  }

  /**
   * Check if a new appointment at 8:30 will overlap with an existing appointment at 9:00
   * @param {Date} newAppointmentStartTime - Start time of the new appointment
   * @param {Date} existingAppointmentStartTime - Start time of the existing appointment
   * @returns {boolean} True if there is an overlap, false otherwise
   */
  static checkAppointmentOverlap(newAppointmentStartTime, existingAppointmentStartTime) {
    const newAppointmentEndTime = new Date(newAppointmentStartTime.getTime() + 30 * 60000);
    const existingAppointmentEndTime = new Date(
      existingAppointmentStartTime.getTime() + 30 * 60000
    );

    return (
      (newAppointmentStartTime >= existingAppointmentStartTime &&
        newAppointmentStartTime < existingAppointmentEndTime) ||
      (newAppointmentEndTime > existingAppointmentStartTime &&
        newAppointmentEndTime <= existingAppointmentEndTime)
    );
  }
}

export default AppointmentService;
