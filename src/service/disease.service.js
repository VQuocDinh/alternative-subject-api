import { BadRequestError, NotFoundError } from '../core/error.response';
import db from '../models';

class DiseaseService {
  /**
   * Search diseases by code, name, or description
   * @param {Object} params - Query parameters
   * @param {string} params.query - Search query
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @returns {Object} Paginated diseases
   */
  static async searchDiseases({ query, page = 1, limit = 20 }) {
    if (!query) {
      throw new BadRequestError('Search query is required');
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { rows: diseases, count } = await db.Disease.findAndCountAll({
      where: {
        [db.Sequelize.Op.or]: [
          { code: { [db.Sequelize.Op.like]: `%${query}%` } },
          { name: { [db.Sequelize.Op.like]: `%${query}%` } },
          { description: { [db.Sequelize.Op.like]: `%${query}%` } },
        ],
      },
      offset,
      limit: parseInt(limit),
      order: [['created_at', 'DESC']],
    });

    return {
      data: diseases,
      meta: {
        currentPage: parseInt(page),
        itemsPerPage: parseInt(limit),
        totalPages: Math.ceil(count / parseInt(limit)),
        totalItems: count,
      },
    };
  }
}

export default DiseaseService;
