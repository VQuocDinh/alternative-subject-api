import db from "../models/index.js";
import path from "path";
import { promises as fs } from "fs";
import { spawn } from "child_process";
import { where } from "sequelize";

const getAll = async (req, res) => {
  try {
    const response = await db.patients.findAll();
    return res.status(200).json({ success: true, data: response });
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred while get patients.",
      error: error.message,
    });
  }
};

const saveImageToFile = async (image, filePath) => {
  const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
  const imageBuffer = Buffer.from(base64Data, "base64");
  await fs.writeFile(filePath, imageBuffer);
};

const recognizeFace = (imagePath) => {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn("python", ["face_recognition.py", imagePath]);
    let output = "";

    pythonProcess.stdout.on("data", (data) => {
      output += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      console.error(`Python script error: ${data}`);
    });

    pythonProcess.on("close", (code) => {
      if (code !== 0) {
        reject(new Error("Error processing image"));
      } else {
        resolve(output.trim());
      }
    });
  });
};

const getById = async (patientId) => {
  const response = await db.patients.findByPk(patientId);
  return response;
};

const getByFace = async (req, res) => {
  const { image } = req.body;
  if (!image) {
    return res
      .status(400)
      .json({ success: false, message: "No image data provided" });
  }

  const tempFileName = `temp_${Date.now()}.jpg`;
  const tempFilePath = path.join(__dirname, "uploads", tempFileName);

  try {
    await saveImageToFile(image, tempFilePath);
    const patientId = await recognizeFace(tempFilePath);

    if (patientId && patientId !== "Not found") {
      const patient = await getById(patientId);
      if (patient) {
        res.json({ data: patient });
      } else {
        res.status(404).json({ error: "Patient not found" });
      }
    } else {
      res.status(404).json({ error: "Face not recognized" });
    }
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    await fs.unlink(tempFilePath).catch(console.error);
  }
};

const findByPk = async (req, res) => {
  try {
    const { patientId } = req.body;
    console.log({ patientId });
    console.log(patientId);

    const response = await db.patients.findByPk(patientId);
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

const searchPatient = async (req, res) => {
  const { cccd } = req.body;
  try {
    const response = await db.patients.findAll({
      where: { cccd: cccd },
    });
    if (response && response.length > 0) {
      res.status(200).json({ success: true, data: response });
    } else {
      res.status(201).json({ success: false, message: "Not found patient" });
    }
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while get patients.",
      error: error.message,
    });
  }
};

const deletePatient = async (req, res) => {
  const { patientId } = req.body;
  try {
    const response = await db.patients.update(
      {
        status: 0,
      },
      {
        where: { patient_id: patientId },
      }
    );
    if (response) {
      res.status(200).json({ success: true, message: "Delete successed" });
    }
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while delete patients.",
      error: error.message,
    });
  }
};

const addPatient = async (req, res) => {
  const {
    full_name,
    phone_number,
    cccd,
    date_of_birth,
    avatar,
    gender,
    email,
    address,
    emergency_contact_name,
    emergency_contact_phone,
    blood_type,
  } = req.body;
  console.log(req.body)

  try {
    const response = await db.patients.create({
      full_name: full_name,
      phone_number: phone_number,
      cccd: cccd,
      date_of_birth: date_of_birth,
      avatar: avatar,
      gender: gender,
      email: email,
      address: address,
      emergency_contact_name: emergency_contact_name,
      emergency_contact_phone: emergency_contact_phone,
      blood_type: blood_type,
    });
    if (response) {
      res.status(200).json({
        success: true,
        message: "Add patient successed",
        patientId: response.patient_id,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "An error occurred while add patinet.",
      error: error.message,
      error
    });
  }
};

const editPatient = async (req, res) => {
  const formValues = req.body;
  console.log(formValues);
  try {
    const response = await db.patients.update(
      {
        email: formValues.email,
        phone_number: formValues.phone,
        full_name: formValues.fullName,
        gender: formValues.gender,
        date_of_birth: formValues.dateOfBirth,
        address: formValues.address,
        cccd: formValues.cccd,
        emergency_contact_name: formValues.emergency_contact_name,
        emergency_contact_name: formValues.emergency_contact_name,
      },
      {
        where: { patient_id: formValues.patientId },
      }
    );
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
export {
  getAll,
  getByFace,
  findByPk,
  searchPatient,
  deletePatient,
  addPatient,
  editPatient,
};
