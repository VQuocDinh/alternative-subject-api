import db from "../models/index.js";

const getPatientRecordsByPatient = async (req, res) => {
  const patient_id = req.body.patientId;
  try {
    const response = await db.patient_records.findAll({
      where: { patient_id: patient_id },
      include: [
        { model: db.patients },
        { model: db.staff },
        { model: db.departments },
        { model: db.bill },
      ],
    });
    return res.status(200).json({ success: true, data: response });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while get patient records.",
      error: error.message,
    });
  }
};

const getPatientRecordsByRecord = async (req, res) => {
  const patient_records_id = req.body;
  try {
    const response = await db.patient_records.findAll({
      where: { patient_records_id: patient_records_id },
      include: [
        { model: db.patients },
        { model: db.staff },
        { model: db.departments },
        { model: db.bill },
      ],
    });
    return res.status(200).json({ success: true, data: response });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while get patient records.",
      error: error.message,
    });
  }
};

const addPatientRecords = async (req, res) => {
  const { patientId, staffId, note, departmentId } = req.body;
  try {
    const response = await db.patient_records.create({
      patient_id: patientId,
      staff_id: staffId,
      note: note,
      department_id: departmentId,
    });
    res.status(200).json({
      success: true,
      data: response,
      message: "Added successful patient records ",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while add patient records.",
      error: error.message,
    });
  }
};

const updatePatientRecords = async (req, res) => {
  const { patient_records_id, symptoms, diagnosis } = req.body;
  try {
    const response = await db.patient_records.update({
      symptoms,
      diagnosis,
      status:'Completed'
    },
    {where: {patient_records_id:patient_records_id}}
  );
    res.status(200).json({
      success: true,
      data: response,
      message: "Update successful patient records ",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while add patient records.",
      error: error.message,
    });
  }
};

export {
  getPatientRecordsByPatient,
  addPatientRecords,
  getPatientRecordsByRecord,
  updatePatientRecords,
};
