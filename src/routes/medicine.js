import {Router} from "express"
import { asyncHandler } from "../helper/asyncHandler"
import {getAllMedicine} from '../controllers';

const MedicineRouter = Router()
MedicineRouter.get('/get', asyncHandler(getAllMedicine))

export default MedicineRouter