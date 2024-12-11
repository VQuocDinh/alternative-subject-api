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

export default router;
