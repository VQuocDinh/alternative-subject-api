import express from 'express';
import { asyncHandler } from '../helper/asyncHandler';
import doctorController from '../controllers/doctor.controller';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Doctor
 *   description: API for managing doctors
 */

/**
 * @swagger
 * /doctor:
 *   get:
 *     summary: Retrieve all doctors
 *     tags: [Doctor]
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
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: A list of doctors
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                 meta:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                     itemsPerPage:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     totalItems:
 *                       type: integer
 *       500:
 *         description: Internal server error
 */
router.get('/', asyncHandler(doctorController.getAllDoctors));

/**
 * @swagger
 * /doctor/{id}:
 *   get:
 *     summary: Retrieve a specific doctor by ID
 *     tags: [Doctor]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the doctor
 *     responses:
 *       200:
 *         description: Doctor retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *       404:
 *         description: Doctor not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', asyncHandler(doctorController.getDoctorById));

/**
 * @swagger
 * /doctor:
 *   post:
 *     summary: Create a new doctor
 *     tags: [Doctor]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *     responses:
 *       201:
 *         description: Doctor created successfully
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Internal server error
 */
router.post('/', asyncHandler(doctorController.addDoctor));

/**
 * @swagger
 * /doctor/{id}:
 *   put:
 *     summary: Update a doctor
 *     tags: [Doctor]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the doctor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *     responses:
 *       200:
 *         description: Doctor updated successfully
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Doctor not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', asyncHandler(doctorController.updateDoctor));

/**
 * @swagger
 * /doctor/{id}:
 *   delete:
 *     summary: Delete a doctor
 *     tags: [Doctor]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the doctor
 *     responses:
 *       200:
 *         description: Doctor deleted successfully
 *       404:
 *         description: Doctor not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', asyncHandler(doctorController.deleteDoctor));

/**
 * @swagger
 * /doctor/specialization/{specialization_id}:
 *   get:
 *     summary: Retrieve doctors by specialization ID
 *     tags: [Doctor]
 *     parameters:
 *       - in: path
 *         name: specialization_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the specialization
 *     responses:
 *       200:
 *         description: Doctors retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *       404:
 *         description: Specialization not found
 *       500:
 *         description: Internal server error
 */
router.get(
  '/specialization/:specialization_id',
  asyncHandler(doctorController.getDoctorBySpecialization)
);

/**
 * @swagger
 * /doctor/{doctor_id}/availability:
 *   get:
 *     summary: Retrieve all availabilities for a doctor
 *     tags: [Doctor]
 *     parameters:
 *       - in: path
 *         name: doctor_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the doctor
 *     responses:
 *       200:
 *         description: A list of availabilities
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   doctor_id:
 *                     type: integer
 *                   day_of_week:
 *                     type: string
 *                   start_time:
 *                     type: string
 *                     format: date-time
 *                   end_time:
 *                     type: string
 *                     format: date-time
 *                   is_available:
 *                     type: boolean
 *       404:
 *         description: Doctor not found
 *       500:
 *         description: Internal server error
 */
router.get('/:doctor_id/availability', asyncHandler(doctorController.getAllAvailabilities));

/**
 * @swagger
 * /doctor/availability/{id}:
 *   get:
 *     summary: Retrieve a specific availability by ID
 *     tags: [Doctor]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the availability
 *     responses:
 *       200:
 *         description: Availability retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 doctor_id:
 *                   type: integer
 *                 day_of_week:
 *                   type: string
 *                 start_time:
 *                   type: string
 *                   format: date-time
 *                 end_time:
 *                   type: string
 *                   format: date-time
 *                 is_available:
 *                   type: boolean
 *       404:
 *         description: Availability not found
 *       500:
 *         description: Internal server error
 */
router.get('/availability/:id', asyncHandler(doctorController.getAvailabilityById));

/**
 * @swagger
 * /doctor/availability:
 *   post:
 *     summary: Create a new availability
 *     tags: [Doctor]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               doctor_id:
 *                 type: integer
 *               day_of_week:
 *                 type: string
 *               start_time:
 *                 type: string
 *                 format: date-time
 *               end_time:
 *                 type: string
 *                 format: date-time
 *               is_available:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Availability created successfully
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Internal server error
 */
router.post('/availability', asyncHandler(doctorController.addAvailability));

/**
 * @swagger
 * /doctor/availability/{id}:
 *   put:
 *     summary: Update an availability
 *     tags: [Doctor]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the availability
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               doctor_id:
 *                 type: integer
 *               day_of_week:
 *                 type: string
 *               start_time:
 *                 type: string
 *                 format: date-time
 *               end_time:
 *                 type: string
 *                 format: date-time
 *               is_available:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Availability updated successfully
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Availability not found
 *       500:
 *         description: Internal server error
 */
router.put('/availability/:id', asyncHandler(doctorController.updateAvailability));

/**
 * @swagger
 * /doctor/availability/{id}:
 *   delete:
 *     summary: Delete an availability
 *     tags: [Doctor]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the availability
 *     responses:
 *       200:
 *         description: Availability deleted successfully
 *       404:
 *         description: Availability not found
 *       500:
 *         description: Internal server error
 */
router.delete('/availability/:id', asyncHandler(doctorController.deleteAvailability));

/**
 * @swagger
 * /doctor/{doctor_id}/availability/between:
 *   get:
 *     summary: Retrieve all availabilities for a doctor between start time and end time
 *     tags: [Doctor]
 *     parameters:
 *       - in: path
 *         name: doctor_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the doctor
 *       - in: query
 *         name: start_time
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *         description: The start time
 *       - in: query
 *         name: end_time
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *         description: The end time
 *     responses:
 *       200:
 *         description: A list of availabilities
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   doctor_id:
 *                     type: integer
 *                   day_of_week:
 *                     type: string
 *                   start_time:
 *                     type: string
 *                     format: date-time
 *                   end_time:
 *                     type: string
 *                     format: date-time
 *                   is_available:
 *                     type: boolean
 *       404:
 *         description: Doctor not found
 *       500:
 *         description: Internal server error
 */
router.get(
  '/:doctor_id/availability/between',
  asyncHandler(doctorController.getAvailabilitiesBetween)
);

export default router;
