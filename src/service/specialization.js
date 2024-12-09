import db from '../models';

class SpecializationService {
  async getAll() {
    try {
      const specializations = await db.Specialization.findAll({
        attributes: ['id', 'specialization_name'], // Including 'id' for the frontend to use
        order: [['created_at', 'DESC']], // Sort by creation date in descending order
      });

      // If no specializations found, return an empty array
      if (!specializations || specializations.length === 0) {
        return [];
      }

      return specializations; // Return the array of specializations
    } catch (error) {
      console.error('Error fetching specializations:', error);
      throw new Error('Failed to fetch specializations');
    }
  }
}

const specializationService = new SpecializationService();
export default specializationService;
