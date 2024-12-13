import express from 'express';
import { asyncHandler } from '../../helper/asyncHandler';
import DiseaseController from '../../controllers/disease.controller';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Disease
 *   description: API for managing diseases
 */

/**
 * @swagger
 * /disease/search:
 *   get:
 *     summary: Search diseases by code, name, or description
 *     tags: [Disease]
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *           description: Search query
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           description: Number of items per page
 *     responses:
 *       200:
 *         description: List of diseases matching the query
 */
router.get('/search', asyncHandler(DiseaseController.searchDiseases));

export default router;
