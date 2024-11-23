import * as controllers from '../controllers'
import express from 'express'

const router =express.Router()
router.get('/get', controllers.getAppointment)
router.post('/add', controllers.addAppointment)
router.post('/getByPatient', controllers.getAppointmentByPatient)
export default router