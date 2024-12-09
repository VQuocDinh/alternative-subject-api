import {Router} from "express"
import { asyncHandler } from "../helper/asyncHandler"
import { checkDrugInteraction } from "../controllers/drugInteraction"

const DrugInteractions = Router()
DrugInteractions.post('/check', asyncHandler(checkDrugInteraction))

export default DrugInteractions