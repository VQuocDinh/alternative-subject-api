import express from 'express';
import { asyncHandler } from '../../helper/asyncHandler';
import medicalRecordController from '../../controllers/medicalRecord.controller';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Medical Records
 *   description: API for managing medical records
 */

/**
 * @swagger
 * /medical-records:
 *   get:
 *     summary: Retrieve all medical records
 *     tags: [Medical Records]
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
 *         description: A list of medical records
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
router.get('/', asyncHandler(medicalRecordController.getAllMedicalRecords));

/**
 * @swagger
 * /medical-records/{id}:
 *   get:
 *     summary: Retrieve a specific medical record by ID
 *     tags: [Medical Records]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the medical record
 *     responses:
 *       200:
 *         description: Medical record retrieved successfully
 *       404:
 *         description: Medical record not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', asyncHandler(medicalRecordController.getMedicalRecordById));

/**
 * @swagger
 * /medical-records:
 *   post:
 *     summary: Create a new medical record
 *     tags: [Medical Records]
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
 *               diagnosis:
 *                 type: string
 *               symptoms:
 *                 type: string
 *               treatment_plan:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [in_treatment, completed]
 *             required:
 *               - patient_id
 *               - doctor_id
 *               - diagnosis
 *     responses:
 *       201:
 *         description: Medical record created successfully
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Internal server error
 */
router.post('/', asyncHandler(medicalRecordController.addMedicalRecords));

/**
 * @swagger
 * /medical-records/{id}/status:
 *   patch:
 *     summary: Update the status of a medical record
 *     tags: [Medical Records]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the medical record
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [in_treatment, completed, cancelled]
 *     responses:
 *       200:
 *         description: Status updated successfully
 *       400:
 *         description: Invalid status value
 *       404:
 *         description: Medical record not found
 *       500:
 *         description: Internal server error
 */
router.patch('/:id/status', asyncHandler(medicalRecordController.changeStatusMedicalRecord));

/**
 * @swagger
 * /medical-records/{id}:
 *   delete:
 *     summary: Delete a medical record
 *     tags: [Medical Records]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the medical record
 *     responses:
 *       200:
 *         description: Medical record deleted successfully
 *       404:
 *         description: Medical record not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', asyncHandler(medicalRecordController.deleteMedicalRecord));

export default router;
