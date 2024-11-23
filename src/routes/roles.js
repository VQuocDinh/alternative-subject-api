import * as controllers from '../controllers'
import express from 'express'

const router =express.Router()
router.get('/get', controllers.getRoles)
export default router