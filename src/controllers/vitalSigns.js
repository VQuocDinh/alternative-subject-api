import db from "../models/index.js";

const getVitalSignsByPatient = async (req, res) => {
  try {
    const patient_id = req.body.patientId;
    const response = await db.vital_signs.findAll({
        where: {patient_id: patient_id}
    });
    return res.status(200).json({ success: true, data: response });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while get medical records by id.",
      error: error.message,
    });
  }
};

const getVitalSignsByDate = async (req, res) => {
  try {
    const patient_id = req.body.patientId;
    const response = await db.vital_signs.findOne({
        where: {patient_id: patient_id},
        order: [['measured_at', 'DESC']],
        include: [
          {model: db.staff}
        ],
    });
    return res.status(200).json({ success: true, data: response });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while get medical records by id.",
      error: error.message,
    });
  }
};

const getVitalSignsByPatientRecords = async (req, res) => {
  try {
    const patient_records_id = req.body.patient_records_id;
    const response = await db.vital_signs.findAll({
        where: {patient_records_id: patient_records_id},
        include: [
          {model: db.staff}
        ],
    });
    return res.status(200).json({ success: true, data: response[0] });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while get medical records by id.",
      error: error.message,
    });
  }
};

const editVitalSigns = async (req, res) => {
  try {
    const { patient_records_id, vital_signs } = req.body;

    if (!patient_records_id || !vital_signs) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: patient_records_id or vital_signs",
      });
    }

    const existingRecord = await db.vital_signs.findOne({
      where: { patient_records_id: patient_records_id }
    });

    let response;
    if (existingRecord) {
      response = await db.vital_signs.update(vital_signs, {
        where: { patient_records_id: patient_records_id }
      });
    } else {
      response = await db.vital_signs.create({
        patient_records_id,
        ...vital_signs
      });
    }

    return res.status(200).json({ 
      success: true, 
      message: "Vital signs updated successfully",
      data: response 
    });
  } catch (error) {
    console.error("Error in editVitalSigns:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating vital signs.",
      error: error.message,
    });
  }
};

const addVitalSigns = async (req, res) => {
  try {
    const data = req.body;
    const response = await db.vital_signs.create({
      patient_records_id: data.patient_records_id,
      patient_id: data.patientId
    });
    return res.status(200).json({ success: true, data: response });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while get medical records by id.",
      error: error.message,
    });
  }
};
export { getVitalSignsByPatient, getVitalSignsByPatientRecords, getVitalSignsByDate, editVitalSigns, addVitalSigns };
