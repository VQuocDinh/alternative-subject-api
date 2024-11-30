import * as controllers from '../controllers'
import express from 'express'

const router =express.Router()
router.get('/getByPatient', controllers.getPrescriptionByPaTient)

export default router