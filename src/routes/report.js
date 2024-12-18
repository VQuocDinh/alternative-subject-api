import express from 'express';
import { asyncHandler } from '../helper/asyncHandler';
import reportController from '../controllers/report.controller';

const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Report
 *   description: API for get report
 */

router.get('/statistics', asyncHandler(reportController.getStatistics));
router.get('statistics/monthly-visits', asyncHandler(reportController.getMonthlyVisits));

export default router;
