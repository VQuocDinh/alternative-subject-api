import { getPrescriptionByPaTient, getPrescriptionById, addPrescription } from '../controllers'
import express from 'express'

const router =express.Router()
router.get('/getByPatient', getPrescriptionByPaTient)
router.get('/getById', getPrescriptionById)
router.post('/addPrescription', addPrescription)

export default router