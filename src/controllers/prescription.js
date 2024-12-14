import prescriptionService from '../service/prescription.js';
import { SuccessResponse } from '../core/success.response.js';

class PrescriptionController {
  getPrescriptionByPaTient = async (req, res, next) => {
    const { patientId } = req.params;
    new SuccessResponse({
      message: 'Prescriptions retrieved successfully',
      metadata: await prescriptionService.getPrescriptionByPatient(patientId),
    }).send(res);
  };

  getPrescriptionById = async (req, res, next) => {
    new SuccessResponse({
      message: 'Prescription detail retrieved successfully',
      metadata: await prescriptionService.getPrescriptionById(req.params.id),
    }).send(res);
  };

  addPrescription = async (req, res, next) => {
    new SuccessResponse({
      message: 'Add Prescription successfully',
      metadata: await prescriptionService.addPrescription(req.body),
    }).send(res);
  };
}

export default new PrescriptionController();
