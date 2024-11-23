import db from "../models";

const getRecordIndicatorsByPatient = async (req, res) => {
  const { record_id } = req.body;
  try {
    const result = await db.sequelize.query(
      `SELECT 
        hi.name AS TenChiSo, 
        ri.value AS GiaTri, 
        hi.unit AS DonVi 
      FROM record_indicators AS ri
      JOIN health_indicators AS hi ON ri.indicator_id = hi.indicator_id
      JOIN medical_records AS mr ON ri.record_id = mr.id
      WHERE mr.id = :record_id`,  // Thay đổi từ patient_id thành record_id
      {
        replacements: { record_id: record_id },
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    if (result.length > 0) {
      res.json({ success: true, data: result });
    } else {
      res.json({ success: false, message: "No records found" });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while getting medical records by record ID.",
      error: error.message,
    });
  }
};

export { getRecordIndicatorsByPatient };