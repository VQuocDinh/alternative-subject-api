import * as controllers from '../controllers';
import express from 'express';
import { asyncHandler } from '../helper/asyncHandler';

const router = express.Router();
/**
 * @swagger
 * /patient/get:
 *   get:
 *     summary: Get all patients
 *     description: Retrieve a paginated list of patients from the database.
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of records to return per page.
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number to retrieve.
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of patients.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   description: Total number of patients.
 *                 page:
 *                   type: integer
 *                   description: Current page number.
 *                 limit:
 *                   type: integer
 *                   description: Number of records per page.
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 */
router.get('/get', asyncHandler(controllers.getAll));
router.post('/add', controllers.addPatient);
router.post('/getByFace', controllers.getByFace);
router.post('/getById', controllers.findByPk);
router.post('/search', controllers.searchPatient);
router.post('/delete', controllers.deletePatient);
router.post('/edit', controllers.editPatient);
export default router;
