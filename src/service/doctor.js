import { where } from 'sequelize';
import db from '../models';

class DoctorService {
  async getDoctorBySpecialization(specialization_id) {
    if (!specialization_id) {
      throw new Error('Specialization ID is required');
    }

    try {
      const doctors = await db.Doctor.findAll({
        include: [
          {
            model: db.Specialization,
            through: db.DoctorSpecialization,
            where: { id : specialization_id},
          },
        ],
      });

      return doctors; // Return the array of specializations
    } catch (error) {
      console.error('Error fetching specializations:', error);
      throw new Error('Failed to fetch specializations');
    }
  }
}

const doctorService = new DoctorService();
export default doctorService;
