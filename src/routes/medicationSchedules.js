import express from 'express';
import { asyncHandler } from '../helper/asyncHandler';
import medicationScheduleController from '../controllers/medicationSchedule.controller.js';

const router = express.Router();

router.get('/', asyncHandler(medicationScheduleController.getMedicationSchedule));

export default router;
