import { where } from 'sequelize';
import db from '../models';

class Prescription {
  async getPrescriptionByPaTient(patient_id) {
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
            where: { patient_id },
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

  async getPrescriptionById(id) {
    if (!id) {
      return {
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: 'Invalid prescription ID provided.',
        },
      };
    }
    try {
      const prescription = await db.Prescription.findByPk(id, {
        include: [
          {
            model: db.Doctor,
            as: 'doctor',
            include: [{ model: db.Specialization }],
          },
        ],
      });

      if (!prescription) {
        return {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Prescription not found.',
          },
        };
      }

      return {
        success: true,
        data: prescription,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'Error retrieving prescription by ID.',
          details: error.message,
        },
      };
    }
  }

  async addPrescription(prescriptionData) {
    try {
      const { medical_record_id, doctor_id, notes, status } = prescriptionData;
      if (!medical_record_id || !doctor_id) {
        throw new Error('Medical record ID and doctor ID are required');
      }
      const newPrescription = await db.Prescription.create({
        medical_record_id,
        doctor_id,
        notes,
        status: status || 'new',
        prescribed_at: new Date(),
      });
      return {
        success: true,
        data: newPrescription,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'Error adding prescription.',
          details: error.message,
        },
      };
    }
  }
}

const prescriptionService = new Prescription();
export default prescriptionService;
