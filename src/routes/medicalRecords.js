import * as controllers from '../controllers'
import express from 'express'

const router =express.Router()
router.post('/getById', controllers.getById)
router.post('/add', controllers.addMedicalRecords)
export default router