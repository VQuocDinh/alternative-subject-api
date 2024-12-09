import specializationService from '../service/specialization.js';
import { SuccessResponse } from '../core/success.response.js';

const getSpecialization = async (req, res, next) => {
  new SuccessResponse({
    message: 'All specialization names',
    metadata: await specializationService.getAll(),
  }).send(res);
};

export { getSpecialization };
