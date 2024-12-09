import {getDoctorBySpecialization} from '../controllers';
import express from 'express';
import { asyncHandler } from '../helper/asyncHandler';

const router = express.Router();

router.get('/getDoctorBySpecialization', asyncHandler(getDoctorBySpecialization));


export default router;
