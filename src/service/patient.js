import db from '../models';

class PatientService {
  async getAll({ limit = 20, page = 1 }) {
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const { rows: patients, count } = await db.Patient.findAndCountAll({
      offset: offset,
      limit: parseInt(limit),
      order: [['created_at', 'DESC']],
    });
    // Example
    /**
     * If not founr
     * throw new Error("........")
     */
    return {
      data: patients,
      meta: {
        currentPage: parseInt(page),
        itemsPerPage: parseInt(limit),
        totalPages: Math.ceil(count / parseInt(limit)),
        totalItems: count,
      },
    };
  }
}

const patientService = new PatientService();
export default patientService;
