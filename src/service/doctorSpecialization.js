import db from '../models';

class DoctorSpecializationService {
  async getAll(specialization_id) {
    if (!specialization_id) {
      throw new Error('Specialization ID is required');
    }

    try {
      const doctors = await db.DoctorSpecialization.findAll({
        where: {
          specialization_id,
        },
        include: [
          {
            model: db.Doctor,
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

const doctorSpecializationService = new DoctorSpecializationService();
export default doctorSpecializationService;
