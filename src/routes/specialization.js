import {getSpecialization} from '../controllers';
import express from 'express';
import { asyncHandler } from '../helper/asyncHandler';

const router = express.Router();

router.get('/get', asyncHandler(getSpecialization));


export default router;
