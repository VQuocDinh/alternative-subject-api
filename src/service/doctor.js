import { BadRequestError, NotFoundError } from '../core/error.response';
import db from '../models';

class DoctorService {
  /**
   * Get all doctors with pagination
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @returns {Object} Paginated doctors
   */
  static async getAllDoctors({ page = 1, limit = 20 }) {
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { rows: doctors, count } = await db.Doctor.findAndCountAll({
      offset,
      limit: parseInt(limit),
      order: [['created_at', 'DESC']], // Specify the column to sort by
    });

    return {
      data: doctors,
      meta: {
        currentPage: parseInt(page),
        itemsPerPage: parseInt(limit),
        totalPages: Math.ceil(count / parseInt(limit)),
        totalItems: count,
      },
    };
  }

  /**
   * Get a single doctor by ID
   * @param {number} id - Doctor ID
   * @returns {Object} Doctor
   * @throws {NotFoundError} If the doctor is not found
   */
  static async getDoctorById(id) {
    const doctor = await db.Doctor.findByPk(id);
    if (!doctor) {
      throw new NotFoundError('Doctor not found');
    }
    return doctor;
  }

  /**
   * Add a new doctor
   * @param {Object} doctorData - Doctor data
   * @returns {Object} New doctor
   * @throws {BadRequestError} If required fields are missing
   */
  static async addDoctor(doctorData) {
    const { name, specialization_id } = doctorData;

    // Validate input data
    if (!name || !specialization_id) {
      throw new BadRequestError('Name and Specialization ID are required');
    }

    const newDoctor = await db.Doctor.create(doctorData);
    return newDoctor;
  }

  /**
   * Update a doctor
   * @param {number} id - Doctor ID
   * @param {Object} doctorData - Doctor data
   * @returns {Object} Updated doctor
   * @throws {NotFoundError} If the doctor is not found
   */
  static async updateDoctor(id, doctorData) {
    const doctor = await db.Doctor.findByPk(id);
    if (!doctor) {
      throw new NotFoundError('Doctor not found');
    }

    await doctor.update(doctorData);
    return doctor;
  }

  /**
   * Delete a doctor by ID
   * @param {number} id - Doctor ID
   * @returns {string} Deletion success message
   * @throws {NotFoundError} If the doctor is not found
   */
  static async deleteDoctor(id) {
    const doctor = await db.Doctor.findByPk(id);
    if (!doctor) {
      throw new NotFoundError('Doctor not found');
    }

    await doctor.destroy();
    return 'Doctor deleted successfully';
  }

  /**
   * Get doctors by specialization ID
   * @param {number} specialization_id - Specialization ID
   * @returns {Array} List of doctors
   * @throws {BadRequestError} If specialization ID is missing
   */
  static async getDoctorBySpecialization(specialization_id) {
    if (!specialization_id) {
      throw new BadRequestError('Specialization ID is required');
    }

    const doctors = await db.Doctor.findAll({
      include: [
        {
          model: db.Specialization,
          through: db.DoctorSpecialization,
          where: { id: specialization_id },
        },
      ],
    });

    return doctors;
  }

  /**
   * Get all availabilities for a doctor
   * @param {number} doctor_id - Doctor ID
   * @returns {Array} List of availabilities
   */
  static async getAllAvailabilities(doctor_id) {
    return await db.DoctorAvailability.findAll({ where: { doctor_id } });
  }

  /**
   * Get all availabilities for a doctor between start time and end time
   * @param {number} doctor_id - Doctor ID
   * @param {string} start_time - Start time
   * @param {string} end_time - End time
   * @returns {Array} List of availabilities
   */
  static async getAvailabilitiesBetween(doctor_id, start_time, end_time) {
    return await db.DoctorAvailability.findAll({
      where: {
        doctor_id,
        start_time: {
          [db.Sequelize.Op.between]: [start_time, end_time],
        },
      },
    });
  }

  /**
   * Get a single availability by ID
   * @param {number} id - Availability ID
   * @returns {Object} Availability
   * @throws {NotFoundError} If the availability is not found
   */
  static async getAvailabilityById(id) {
    const availability = await db.DoctorAvailability.findByPk(id);
    if (!availability) {
      throw new NotFoundError('Availability not found');
    }
    return availability;
  }

  /**
   * Add a new availability
   * @param {Object} availabilityData - Availability data
   * @returns {Object} New availability
   * @throws {BadRequestError} If required fields are missing or if there is an overlap with existing availabilities
   */
  static async addAvailability(availabilityData) {
    const { doctor_id, day_of_week, start_time, end_time } = availabilityData;

    // Validate input data
    if (!doctor_id || !day_of_week || !start_time || !end_time) {
      throw new BadRequestError('Doctor ID, day of week, start time, and end time are required');
    }

    // Check for overlapping availabilities
    const overlappingAvailabilities = await db.DoctorAvailability.findAll({
      where: {
        doctor_id,
        day_of_week,
        [db.Sequelize.Op.or]: [
          {
            start_time: {
              [db.Sequelize.Op.between]: [start_time, end_time],
            },
          },
          {
            end_time: {
              [db.Sequelize.Op.between]: [start_time, end_time],
            },
          },
          {
            [db.Sequelize.Op.and]: [
              {
                start_time: {
                  [db.Sequelize.Op.lte]: start_time,
                },
              },
              {
                end_time: {
                  [db.Sequelize.Op.gte]: end_time,
                },
              },
            ],
          },
        ],
      },
    });

    if (overlappingAvailabilities.length > 0) {
      throw new BadRequestError('Availability overlaps with existing availabilities');
    }

    const newAvailability = await db.DoctorAvailability.create(availabilityData);
    return newAvailability;
  }

  /**
   * Update an availability
   * @param {number} id - Availability ID
   * @param {Object} availabilityData - Availability data
   * @returns {Object} Updated availability
   * @throws {NotFoundError} If the availability is not found
   * @throws {BadRequestError} If there is an overlap with existing availabilities
   */
  static async updateAvailability(id, availabilityData) {
    const availability = await db.DoctorAvailability.findByPk(id);
    if (!availability) {
      throw new NotFoundError('Availability not found');
    }

    const { doctor_id, day_of_week, start_time, end_time } = availabilityData;

    // Check for overlapping availabilities
    const overlappingAvailabilities = await db.DoctorAvailability.findAll({
      where: {
        doctor_id,
        day_of_week,
        id: {
          [db.Sequelize.Op.ne]: id,
        },
        [db.Sequelize.Op.or]: [
          {
            start_time: {
              [db.Sequelize.Op.between]: [start_time, end_time],
            },
          },
          {
            end_time: {
              [db.Sequelize.Op.between]: [start_time, end_time],
            },
          },
          {
            [db.Sequelize.Op.and]: [
              {
                start_time: {
                  [db.Sequelize.Op.lte]: start_time,
                },
              },
              {
                end_time: {
                  [db.Sequelize.Op.gte]: end_time,
                },
              },
            ],
          },
        ],
      },
    });

    if (overlappingAvailabilities.length > 0) {
      throw new BadRequestError('Availability overlaps with existing availabilities');
    }

    await availability.update(availabilityData);
    return availability;
  }

  /**
   * Delete an availability by ID
   * @param {number} id - Availability ID
   * @returns {string} Deletion success message
   * @throws {NotFoundError} If the availability is not found
   */
  static async deleteAvailability(id) {
    const availability = await db.DoctorAvailability.findByPk(id);
    if (!availability) {
      throw new NotFoundError('Availability not found');
    }

    await availability.destroy();
    return 'Availability deleted successfully';
  }
}

export default DoctorService;
