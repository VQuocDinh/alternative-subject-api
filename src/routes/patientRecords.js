import * as controllers from '../controllers'
import express from 'express'

const router =express.Router()
router.post('/getByPatient', controllers.getPatientRecordsByPatient)
router.post('/add', controllers.addPatientRecords)
router.post('/update', controllers.updatePatientRecords)

export default router