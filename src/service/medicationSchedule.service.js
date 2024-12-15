import { Op } from 'sequelize';
import db from '../models';
import { BadRequestError } from '../core/error.response';

class MedicationScheduleService {
  static async getMedicationSchedule(date, prescriptionId) {
    // Validate input
    if (!date || !Date.parse(date)) {
      throw new BadRequestError('Invalid date format');
    }
    if (!prescriptionId) {
      throw new BadRequestError('Prescription ID is required');
    }

    const schedules = await db.MedicationSchedule.findAll({
      where: {
        schedule_time: {
          [Op.between]: [
            new Date(date).setHours(0, 0, 0),
            new Date(date).setHours(23, 59, 59)
          ]
        }
      },
      include: [{
        model: db.PrescriptionMedicine,
        where: {
          prescription_id: prescriptionId
        },
        include: [{
          model: db.Medicine,
          as: 'Medicine'
        }]
      }],
      order: [['schedule_time', 'ASC']]
    });

    return schedules;
  }
}

export default MedicationScheduleService;
