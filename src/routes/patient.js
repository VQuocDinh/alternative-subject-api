import express from 'express';
import patientController from '../controllers/patient';
import { asyncHandler } from '../helper/asyncHandler';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Patients
 *   description: API for managing patients
 */

/**
 * @swagger
 * /patient:
 *   get:
 *     summary: Retrieve all patients
 *     tags: [Patients]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number (default: 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page (default: 20)
 *     responses:
 *       200:
 *         description: A list of patients
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
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
router.get('/', asyncHandler(patientController.getAll));

/**
 * @swagger
 * /patient/face:
 *   post:
 *     summary: Retrieve a patient by face recognition
 *     tags: [Patients]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 description: Base64 encoded image
 *     responses:
 *       200:
 *         description: Patient retrieved successfully
 *       400:
 *         description: No image data provided
 *       404:
 *         description: Face not recognized or patient not found
 *       500:
 *         description: Internal server error
 */
router.post('/face', asyncHandler(patientController.getByFace));

/**
 * @swagger
 * /patient/{id}:
 *   get:
 *     summary: Retrieve a specific patient by ID
 *     tags: [Patients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the patient
 *     responses:
 *       200:
 *         description: Patient retrieved successfully
 *       404:
 *         description: Patient not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', asyncHandler(patientController.findByPk));

/**
 * @swagger
 * /patient/search:
 *   post:
 *     summary: Search for patients by CCCD
 *     tags: [Patients]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cccd:
 *                 type: string
 *                 description: CCCD of the patient
 *     responses:
 *       200:
 *         description: Patients retrieved successfully
 *       404:
 *         description: Patients not found
 *       500:
 *         description: Internal server error
 */
router.post('/search', asyncHandler(patientController.searchPatient));

/**
 * @swagger
 * /patient/searchByNameAndEmail:
 *   post:
 *     summary: Search for patients by name and email
 *     tags: [Patients]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               full_name:
 *                 type: string
 *               email:
 *                 type: string
 *               page:
 *                 type: integer
 *                 description: Page number (default: 1)
 *               limit:
 *                 type: integer
 *                 description: Items per page (default: 20)
 *     responses:
 *       200:
 *         description: Patients retrieved successfully
 *       404:
 *         description: Patients not found
 *       500:
 *         description: Internal server error
 */
router.post('/searchByNameAndEmail', asyncHandler(patientController.searchPatientByNameAndEmail));

/**
 * @swagger
 * /patient:
 *   post:
 *     summary: Create a new patient
 *     tags: [Patients]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               full_name:
 *                 type: string
 *               phone_number:
 *                 type: string
 *               cccd:
 *                 type: string
 *               date_of_birth:
 *                 type: string
 *                 format: date
 *               avatar:
 *                 type: string
 *               gender:
 *                 type: string
 *               email:
 *                 type: string
 *               address:
 *                 type: string
 *               emergency_contact_name:
 *                 type: string
 *               emergency_contact_phone:
 *                 type: string
 *               blood_type:
 *                 type: string
 *     responses:
 *       201:
 *         description: Patient created successfully
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Internal server error
 */
router.post('/', asyncHandler(patientController.addPatient));

/**
 * @swagger
 * /patient/{id}:
 *   patch:
 *     summary: Update a patient
 *     tags: [Patients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the patient
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               phone_number:
 *                 type: string
 *               full_name:
 *                 type: string
 *               gender:
 *                 type: string
 *               date_of_birth:
 *                 type: string
 *                 format: date
 *               address:
 *                 type: string
 *               cccd:
 *                 type: string
 *               emergency_contact_name:
 *                 type: string
 *               emergency_contact_phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Patient updated successfully
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Patient not found
 *       500:
 *         description: Internal server error
 */
router.patch('/:id', asyncHandler(patientController.editPatient));

/**
 * @swagger
 * /patient/{id}:
 *   delete:
 *     summary: Delete a patient
 *     tags: [Patients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the patient
 *     responses:
 *       200:
 *         description: Patient deleted successfully
 *       404:
 *         description: Patient not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', asyncHandler(patientController.deletePatient));

/**
 * @swagger
 * /patient/{id}/appointments:
 *   get:
 *     summary: Retrieve all appointments for a specific patient
 *     tags: [Patients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the patient
 *       - in: query
 *         name: startTime
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Start time to filter appointments
 *       - in: query
 *         name: endTime
 *         schema:
 *           type: string
 *           format: date-time
 *         description: End time to filter appointments
 *     responses:
 *       200:
 *         description: Appointments retrieved successfully
 *       404:
 *         description: No appointments found for the specified patient
 *       500:
 *         description: Internal server error
 */
router.get('/:id/appointments', asyncHandler(patientController.getAppointmentsByPatientId));

export default router;
