import { SuccessResponse } from '../core/success.response';
import drugInteractionService from '../service/drugInteraction';

const checkDrugInteraction = async (req, res, next) => {
  const { selectedDrugs, newDrug } = req.body;
  if (!selectedDrugs || !newDrug || !Array.isArray(selectedDrugs)) {
    throw new Error('Error: Data not provided');
  }
  
  new SuccessResponse({
    message: 'Checking drug interaction',
    metadata: await drugInteractionService.checkDrugInteractions(selectedDrugs, newDrug),
  }).send(res);
};

export { checkDrugInteraction };
