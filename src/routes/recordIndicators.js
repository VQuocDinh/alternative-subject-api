import * as controllers from '../controllers'
import express from 'express'

const router =express.Router()
router.post('/getByPatient', controllers.getRecordIndicatorsByPatient)
export default router