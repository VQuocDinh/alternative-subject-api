import * as controllers from '../controllers'
import express from 'express'

const router =express.Router()
router.get('/get', controllers.getStaff)
router.post('/getById', controllers.getStaffById)
router.post('/add', controllers.addStaff)
router.post('/edit', controllers.editStaff)
router.post('/delete', controllers.deleteStaff)
export default router