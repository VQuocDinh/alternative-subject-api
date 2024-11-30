import prescriptionService from '../service/prescription.js';

const getPrescriptionByPaTient = async (req, res) => {
  try {
    const result = await prescriptionService.getPrescriptionByPaTient();
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

const getPrescriptionById = async (id) => {
  try {
    const response = await prescriptionService.findByPk(id);
    if (response) {
      return res.status(200).json({
        success: true,
        message: 'Prescriptions retrieved successfully',
        data: response,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve patients',
      error: error.message,
    });
  }
};

export { getPrescriptionByPaTient, getPrescriptionById };
