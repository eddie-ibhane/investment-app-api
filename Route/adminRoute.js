import express from 'express'
import { login, logout, register } from '../Controller/adminController.js'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)

export default router