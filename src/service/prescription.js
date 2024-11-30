import db from '../models';

class Prescription {
  async getPrescriptionByPaTient() {
    try {
      const prescriptions = await db.Prescription.findAll({
        order: [['updated_at', 'DESC']],
        attributes: {
          exclude: ['created_at', 'updated_at'],
        },
        include: [
          {
            model: db.Doctor,
            attributes: ['first_name', 'last_name'],
            as: 'doctor',
          },
          {
            model: db.MedicalRecord,
            attributes: ['patient_id'],
          },
        ],
      });
      return {
        success: true,
        data: prescriptions,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error getting prescriptions: ' + error.message,
      };
    }
  }
}

const prescriptionService = new Prescription();
export default prescriptionService;
