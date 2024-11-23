import * as controllers from '../controllers'
import express from 'express'

const router =express.Router()
router.get('/get', controllers.getAll)
router.post('/add', controllers.addPatient)
router.post('/getByFace', controllers.getByFace)
router.post('/getById', controllers.findByPk)
router.post('/search', controllers.searchPatient)
router.post('/delete', controllers.deletePatient)
router.post('/edit', controllers.editPatient)
export default router