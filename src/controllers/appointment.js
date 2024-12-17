import { where } from 'sequelize';
import db from '../models/index.js';

const getAppointment = async (req, res) => {
  try {
    const response = await db.appointments.findAll({
      include: [{ model: db.staff }, { model: db.departments }, { model: db.patients }],
    });
    return res.status(200).json({ success: true, data: response });
  } catch (error) {
    return res.status(500).json({
      message: 'An error occurred while get appointment.',
      error: error.message,
    });
  }
};

const getAppointmentByPatient = async (req, res) => {
  const patient_id = req.body.patientId;
  try {
    const response = await db.appointments.findAll({
      where: { patient_id: patient_id },
      include: [{ model: db.staff }, { model: db.departments }],
    });
    return res.status(200).json({ success: true, data: response });
  } catch (error) {
    return res.status(500).json({
      message: 'An error occurred while get appointment.',
      error: error.message,
    });
  }
};

const addAppointment = async (req, res) => {
  const { patient_id, staff_id, appointment_date, appointment_type, department_id, notes } =
    req.body;
  try {
    const response = await db.appointments.create({
      patient_id: patient_id,
      staff_id: staff_id,
      appointment_date: appointment_date,
      appointment_type: appointment_type,
      department_id: department_id,
      notes: notes,
    });
    return res.status(200).json({ success: true, data: response });
  } catch (error) {
    return res.status(500).json({
      message: 'An error occurred while get appointment.',
      error: error.message,
    });
  }
};
export { getAppointment, addAppointment, getAppointmentByPatient };
