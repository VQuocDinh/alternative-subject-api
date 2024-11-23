import * as controllers from '../controllers'
import express from 'express'

const router =express.Router()
router.get('/get', controllers.getAccount)
export default router