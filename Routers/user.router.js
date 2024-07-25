import express from 'express'
import { fetchUserDetails, logoutUser, signInUser, signUpUser } from '../Controllers/user.controller.js'
import authenticatedUser from '../Middleware/auth.js'

const router = express.Router()

router.post('/sign-up', signUpUser)
router.post('/sign-in', signInUser)
router.get('/get-user', authenticatedUser, fetchUserDetails)
router.get('/logout', logoutUser)

export default router