import { getDoctorBySpecialization } from '../controllers';
import express from 'express';
import { asyncHandler } from '../helper/asyncHandler';

const router = express.Router();

/**
 * @swagger
 * /doctor-specialization/getDoctorBySpecialization:
 *   get:
 *     tags:
 *       - Doctor Specialization
 *     summary: Get doctors by specialization
 *     description: Retrieve a list of doctors based on specialization
 *     parameters:
 *       - name: specialization_id
 *         in: query
 *         required: true
 *         type: integer
 *         description: ID of the specialization
 *     responses:
 *       200:
 *         description: Successful response
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Doctor'
 *       400:
 *         description: Invalid specialization ID
 */
router.get('/getDoctorBySpecialization', asyncHandler(getDoctorBySpecialization));

export default router;
