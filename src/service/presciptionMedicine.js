import { where } from 'sequelize';
import db from '../models';

class PrescriptionMedicine {
  async getPrescriptionMedicine(prescription_id) {
    try {
      const prescription = await db.PrescriptionMedicine.findAll({
        where: { prescription_id },
        include: [{
          model: db.Medicine
        }]
      });

      return {
        success: true,
        data: prescription,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error getting prescription by id: ' + error.message,
      };
    }
  }
}

const prescriptionMedicineService = new PrescriptionMedicine();
export default prescriptionMedicineService;
