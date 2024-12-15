import express from 'express';
import { asyncHandler } from '../helper/asyncHandler';
import PrescriptionController from '../controllers/prescription.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Prescriptions
 *   description: API for managing prescriptions
 */

/**
 * @swagger
 * /prescription/list/{patientId}:
 *   get:
 *     summary: Retrieve prescriptions by patient ID
 *     tags: [Prescriptions]
 *     parameters:
 *       - in: path
 *         name: patientId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the patient
 *     responses:
 *       200:
 *         description: Prescriptions retrieved successfully
 *       404:
 *         description: No prescriptions found
 *       500:
 *         description: Internal server error
 */
router.get('/list/:patientId', asyncHandler(PrescriptionController.getPrescriptionByPaTient));

/**
 * @swagger
 * /prescription/{id}:
 *   get:
 *     summary: Retrieve a specific prescription by ID
 *     tags: [Prescriptions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the prescription
 *     responses:
 *       200:
 *         description: Prescription retrieved successfully
 *       404:
 *         description: Prescription not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', asyncHandler(PrescriptionController.getPrescriptionById));

/**
 * @swagger
 * /prescriptions:
 *   post:
 *     summary: Create a new prescription
 *     tags: [Prescriptions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               medical_record_id:
 *                 type: integer
 *               doctor_id:
 *                 type: integer
 *               prescribed_at:
 *                 type: string
 *                 format: date-time
 *               notes:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [new, ongoing, completed]
 *             required:
 *               - doctor_id
 *               - prescribed_at
 *               - status
 *     responses:
 *       201:
 *         description: Prescription created successfully
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Internal server error
 */
router.post('/add', asyncHandler(PrescriptionController.addPrescription));

export default router;
