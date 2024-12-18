import express from 'express';
import { asyncHandler } from '../../helper/asyncHandler';
import AppointmentController from '../../controllers/appointment.controller';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Appointments
 *   description: API for managing appointments
 */

/**
 * @swagger
 * /appointment:
 *   get:
 *     summary: Get all appointments with pagination
 *     tags: [Appointments]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Appointments retrieved successfully
 */
router.get('/', asyncHandler(AppointmentController.getAllAppointments));

/**
 * @swagger
 * /appointment/{id}:
 *   get:
 *     summary: Get a single appointment by ID
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Appointment ID
 *     responses:
 *       200:
 *         description: Appointment retrieved successfully
 */
router.get('/:id', asyncHandler(AppointmentController.getAppointmentById));

/**
 * @swagger
 * /appointment:
 *   post:
 *     summary: Add a new appointment
 *     tags: [Appointments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               patient_id:
 *                 type: integer
 *               doctor_id:
 *                 type: integer
 *               appointment_taken_date:
 *                 type: string
 *                 format: date-time
 *               actual_start_time:
 *                 type: string
 *                 format: date-time
 *               reason_for_visit:
 *                 type: string
 *     responses:
 *       201:
 *         description: Appointment added successfully
 */
router.post('/', asyncHandler(AppointmentController.addAppointment));

/**
 * @swagger
 * /appointment/{id}:
 *   put:
 *     summary: Update an appointment
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Appointment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               patient_id:
 *                 type: integer
 *               doctor_id:
 *                 type: integer
 *               appointment_taken_date:
 *                 type: string
 *                 format: date-time
 *               actual_start_time:
 *                 type: string
 *                 format: date-time
 *               reason_for_visit:
 *                 type: string
 *     responses:
 *       200:
 *         description: Appointment updated successfully
 */
router.put('/:id', asyncHandler(AppointmentController.updateAppointment));

/**
 * @swagger
 * /appointment/{id}:
 *   delete:
 *     summary: Delete an appointment by ID
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Appointment ID
 *     responses:
 *       200:
 *         description: Appointment deleted successfully
 */
router.delete('/:id', asyncHandler(AppointmentController.deleteAppointment));

/**
 * @swagger
 * /appointment/doctor/{doctorId}:
 *   get:
 *     summary: Get all appointments for a specific doctor on a specific day
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: doctorId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Doctor ID
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Specific date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Appointments retrieved successfully
 */
router.get('/doctor/:doctorId', asyncHandler(AppointmentController.getAppointmentsByDoctorAndDate));

/**
 * @swagger
 * /appointment/doctor/between:
 *   get:
 *     summary: Get all appointments for a specific doctor between two dates
 *     tags: [Appointments]
 *     parameters:
 *       - in: query
 *         name: doctor_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Doctor ID
 *       - in: query
 *         name: start_date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Start date (YYYY-MM-DD)
 *       - in: query
 *         name: end_date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: End date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Appointments retrieved successfully
 */
router.get(
  '/doctor/between',
  asyncHandler(AppointmentController.getAppointmentsByDoctorBetweenDates)
);

/**
 * @swagger
 * /appointment/patient:
 *   get:
 *     summary: Get all appointments for a specific patient with pagination
 *     tags: [Appointments]
 *     parameters:
 *       - in: query
 *         name: patient_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Patient ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Appointments retrieved successfully
 */
router.get('/patient', asyncHandler(AppointmentController.getAppointmentsByPatient));

export default router;
