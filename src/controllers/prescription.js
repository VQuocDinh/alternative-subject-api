import prescriptionService from '../service/prescription.js';

const getPrescriptionByPaTient = async (req, res) => {
  const { patientId } = req.query;
  try {
    const result = await prescriptionService.getPrescriptionByPaTient(patientId);
    if (!result.success) {
      return res.status(500).json(result);
    }

    const prescriptions = result.data;
    if (!prescriptions || prescriptions.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No patieprescriptionsnts found',
        data: [],
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Prescriptions retrieved successfully',
      data: prescriptions,
      total: prescriptions.length,
    });
  } catch (error) {
    console.error('GetAll prescriptions Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve patients',
      error: error.message,
    });
  }
};

const getPrescriptionById = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_INPUT',
        message: 'Prescription ID is required.',
      },
    });
  }

  try {
    const response = await prescriptionService.getPrescriptionById(id);

    if (!response.success) {
      return res.status(500).json({
        success: false,
        error: response.error,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Prescription detail retrieved successfully.',
      data: response.data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'An unexpected error occurred.',
        details: error.message,
      },
    });
  }
};

export { getPrescriptionByPaTient, getPrescriptionById };
