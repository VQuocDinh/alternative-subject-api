import express from 'express';
import { asyncHandler } from '../../helper/asyncHandler';
import TreatmentController from '../../controllers/treatment.controller';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Treatment
 *   description: API for managing the treatment process
 */

/**
 * @swagger
 * /treatment/records:
 *   get:
 *     summary: Retrieve medical records by status
 *     tags: [Treatment]
 *     parameters:
 *       - in: query
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *           description: Status of the medical records
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           description: Number of records per page
 *     responses:
 *       200:
 *         description: List of medical records by status
 */
router.get('/records', asyncHandler(TreatmentController.getRecordsByStatus));

/**
 * @swagger
 * /treatment/records/{id}/status:
 *   patch:
 *     summary: Update the status of a medical record
 *     tags: [Treatment]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Medical Record ID
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               revertToDoctor:
 *                 type: boolean
 *                 description: Revert to "doctor_received" if true
 *                 example: true
 *     responses:
 *       200:
 *         description: Medical record status updated
 */
router.patch('/records/:id/status', asyncHandler(TreatmentController.updateRecordStatus));

/**
 * @swagger
 * /treatment/records/search:
 *   get:
 *     summary: Search medical records by keyword
 *     tags: [Treatment]
 *     parameters:
 *       - in: query
 *         name: keyword
 *         required: true
 *         schema:
 *           type: string
 *           description: Keyword to search (e.g., patient name, diagnosis, doctor name)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           description: Number of records per page
 *     responses:
 *       200:
 *         description: List of medical records matching the keyword
 */
router.get('/records/search', asyncHandler(TreatmentController.searchRecords));

/**
 * @swagger
 * /treatment/records/{id}/resend:
 *   patch:
 *     summary: Resend the medical record to the doctor for new diagnosis
 *     tags: [Treatment]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Medical Record ID
 *     responses:
 *       200:
 *         description: Medical record resent to the doctor
 */
router.patch('/records/:id/resend', asyncHandler(TreatmentController.resendToDoctor));

/**
 * @swagger
 * /treatment/records/{id}/vital-signs:
 *   post:
 *     summary: Add new vital signs for a medical record
 *     tags: [Treatment]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Medical Record ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               temperature:
 *                 type: number
 *                 description: Body temperature in °C
 *                 example: 37.5
 *               blood_pressure:
 *                 type: string
 *                 description: Blood pressure (e.g., 120/80)
 *                 example: "120/80"
 *               heart_rate:
 *                 type: integer
 *                 description: Heart rate (beats per minute)
 *                 example: 72
 *               respiratory_rate:
 *                 type: integer
 *                 description: Respiratory rate (breaths per minute)
 *                 example: 18
 *               weight:
 *                 type: number
 *                 description: Patient's weight in kg
 *                 example: 70.5
 *               height:
 *                 type: number
 *                 description: Patient's height in cm
 *                 example: 175
 *     responses:
 *       200:
 *         description: Vital signs added successfully
 *       400:
 *         description: Invalid input or status
 *       404:
 *         description: Medical record not found
 */
router.post('/records/:id/vital-signs', asyncHandler(TreatmentController.addVitalSigns));

/**
 * @swagger
 * /treatment/records/{id}/vital-signs:
 *   get:
 *     summary: Get all vital signs for a medical record
 *     tags: [Treatment]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Medical Record ID
 *     responses:
 *       200:
 *         description: List of vital signs
 *       404:
 *         description: Medical record not found
 */
router.get('/records/:id/vital-signs', asyncHandler(TreatmentController.getVitalSigns));

/**
 * @swagger
 * /treatment/records/{id}/diagnosis:
 *   patch:
 *     summary: Add diagnosis to a medical record
 *     tags: [Treatment]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Medical Record ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               diagnosis:
 *                 type: string
 *                 description: Diagnosis made by the doctor
 *                 example: "Common cold"
 *               symptoms:
 *                 type: string
 *                 description: Symptoms described by the patient
 *                 example: "Fever, cough"
 *               treatment_plan:
 *                 type: string
 *                 description: Treatment plan prescribed by the doctor
 *                 example: "Paracetamol and rest"
 *               status:
 *                 type: string
 *                 description: Change status of the medical record (optional)
 *                 enum: [waiting_lab, waiting_payment]
 *     responses:
 *       200:
 *         description: Diagnosis added successfully
 *       400:
 *         description: Invalid status or input
 *       404:
 *         description: Medical record not found
 */
router.patch('/records/:id/diagnosis', asyncHandler(TreatmentController.addDiagnosis));

/**
 * @swagger
 * /treatment/records/patient/{patientId}:
 *   get:
 *     summary: Retrieve medical records by patient ID
 *     tags: [Treatment]
 *     parameters:
 *       - in: path
 *         name: patientId
 *         required: true
 *         schema:
 *           type: integer
 *           description: ID of the patient
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           description: Number of records per page
 *     responses:
 *       200:
 *         description: List of medical records by patient ID
 */
router.get('/records/patient/:patientId', asyncHandler(TreatmentController.getRecordsByPatientId));

/**
 * @swagger
 * /treatment/patient/{patientId}/vital-signs:
 *   get:
 *     summary: Get all vital signs of a specific patient
 *     tags: [Treatment]
 *     parameters:
 *       - in: path
 *         name: patientId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Patient ID
 *     responses:
 *       200:
 *         description: List of vital signs of the patient
 *       404:
 *         description: Patient not found
 */
router.get(
  '/patient/:patientId/vital-signs',
  asyncHandler(TreatmentController.getAllVitalSignsByPatientId)
);

/**
 * @swagger
 * /treatment/vital-signs/{id}:
 *   delete:
 *     summary: Delete a vital sign by ID
 *     tags: [Treatment]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Vital Sign ID
 *     responses:
 *       200:
 *         description: Vital sign deleted successfully
 *       404:
 *         description: Vital sign not found
 */
router.delete('/vital-signs/:id', asyncHandler(TreatmentController.deleteVitalSign));

export default router;
