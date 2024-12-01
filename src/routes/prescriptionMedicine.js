import * as controllers from '../controllers'
import express from 'express'

const router =express.Router()
router.get('/get', controllers.getPrescriptionMedicine)

export default router