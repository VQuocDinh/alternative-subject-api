import { SuccessResponse } from '../core/success.response.js';
import DiseaseService from '../service/disease.service.js';

class DiseaseController {
  searchDiseases = async (req, res, next) => {
    new SuccessResponse({
      metadata: await DiseaseService.searchDiseases(req.query),
    }).send(res);
  };
}

export default new DiseaseController();
