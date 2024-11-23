import db from "../models/index.js";

const getHealthIndicator = async (req, res) => {
  try {
    const response = await db.health_indicators.findAll();
    return res.status(200).json({ success: true, data: response });
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred while get health indicator.",
      error: error.message,
    });
  }
};

const getByPatient = async (req, res) => {
  const {patient_id} = req.body
  try {
    const response = await db.health_indicators.findByPk(patient_id);
    return res.status(200).json({ success: true, data: response });
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred while get health indicator by patient.",
      error: error.message,
    });
  }
};
export { getHealthIndicator, getByPatient };
