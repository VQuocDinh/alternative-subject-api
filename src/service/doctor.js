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
}

export default DoctorService;
