import db from "../models/index.js";
const getAllDepartment = async (req, res) => {
  try {
    const response = await db.departments.findAll();
    res.status(200).json({ success: true, data: response });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "An error occurred while get department.",
      error: error.message,
    });
  }
};

export { getAllDepartment };
