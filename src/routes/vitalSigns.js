import * as controllers from '../controllers'
import express from 'express'

const router =express.Router()
router.post('/getByPatient', controllers.getVitalSignsByPatient)
router.post('/getByDate', controllers.getVitalSignsByDate)
router.post('/getByPatientRecords', controllers.getVitalSignsByPatientRecords)
router.post('/edit', controllers.editVitalSigns)
router.post('/add', controllers.addVitalSigns)

export default router