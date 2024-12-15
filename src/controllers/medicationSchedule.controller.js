import { SuccessResponse } from '../core/success.response.js';
import MedicationScheduleService from '../service/medicationSchedule.service.js';

class MedicationScheduleController {
    getMedicationSchedule = async (req, res, next) => {
      try {
        const { date, prescriptionId } = req.query 
        const schedules = await MedicationScheduleService.getMedicationSchedule(date,prescriptionId);
        
        new SuccessResponse({
          message: 'Medication schedule retrieved successfully',
          metadata: schedules,
        }).send(res);
      } catch (error) {
        next(error);
      }
    };
  }

export default new MedicationScheduleController();
