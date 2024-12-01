import prescriptionMedicineService from '../service/presciptionMedicine';

const getPrescriptionMedicine = async (req, res) => {
  const { presciptionId } = req.query;
  try {
    if (!presciptionId) {
      return res.status(500).json({
        success: false,
        message: 'Id does not exist',
      });
    }
    const response = await prescriptionMedicineService.getPrescriptionMedicine(presciptionId);
    if (response) {
      return res.status(200).json({
        success: true,
        message: 'Prescription detail retrieved successfully',
        data: response.data,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve Prescription detail',
      error: error.message,
    });
  }
};

export { getPrescriptionMedicine };
