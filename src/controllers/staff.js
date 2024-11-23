import db from "../models/index.js";

const getStaff = async (req, res) => {
  try {
    const response = await db.staff.findAll(
      {
        include: [
          { model: db.departments },
        ],
      }
    );
    return res.status(200).json({ success: true, data: response });
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred while get staffs.",
      error: error.message,
    });
  }
};

const getStaffById = async (req, res) => {
  try {
    const { staffId } = req.body;
    const response = await db.staff.findByPk(staffId);
    if (response) {
      return res.status(200).json({
        success: true,
        data: response,
      });
    }
    return res.status(400).json({
      success: false,
      message: "Not found patient",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while get patient.",
      error: error.message,
    });
  }
};

const addStaff = async (req, res) => {
  const { formValues } = req.body;
  try {
    const existingUser = await db.staff.findOne({
      where: { email: formValues.email },
    });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        data: "Email already has an account.",
      });
    }
    const response = await db.staff.create({
      email: formValues.email,
      phone_number: formValues.phone,
      full_name: formValues.fullName,
      gender: formValues.gender,
      date_of_birth: formValues.dateOfBirth,
      address: formValues.address,
      position: formValues.position,
      department_id: formValues.department,
      role_id: formValues.role,
    });
    if (response) {
      res.status(200).json({ success: true, data: "Add successed staff" });
    }
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while get staffs.",
      error: error.message,
    });
  }
};

const editStaff = async (req, res) => {
  const formValues = req.body;
  console.log(formValues)
  try {
    const response = await db.staff.update({
      email: formValues.email,
      phone_number: formValues.phone,
      full_name: formValues.fullName,
      gender: formValues.gender,
      date_of_birth: formValues.dateOfBirth,
      address: formValues.address,
      position: formValues.position,
      department_id: formValues.department,
      role_id: formValues.role,
    },
    {
      where: { staff_id: formValues.staffId } 
    });
    if (response) {
      return res
        .status(200)
        .json({ success: true, data: "Staff updated successfully" });
    }
  } catch (error) {
    console.error("Error updating staff:", error);
    return res.status(500).json({
      message: "An error occurred while get staffs.",
      error: error.message,
    });
  }
};

const deleteStaff = async (req, res) => {
  const staffId = req.body.staffId;
  try {
    const response = await db.staff.update({
      status: 0
    },
    {
      where: { staff_id: staffId } 
    });
    if (response) {
      return res
        .status(200)
        .json({ success: true, message: "Staff delete successfully" });
    }
  } catch (error) {
    console.error("Error delete staff:", error);
    return res.status(500).json({
      message: "An error occurred while delete staffs.",
      error: error.message,
    });
  }
};

export { getStaff, getStaffById, addStaff, editStaff, deleteStaff };
