import express from 'express'
import { addProperty, deleteProperty, fetchPropertiesData, updateProperty } from '../Controllers/properties.controller.js'
import authenticatedUser from '../Middleware/auth.js'

const router = express.Router()

router.get('/get/all/properties', fetchPropertiesData)
router.post('/add/properties', authenticatedUser, addProperty)
router.put('/update/property/:id', authenticatedUser, updateProperty)
router.delete('/delete/property/:id',authenticatedUser,deleteProperty)

export default router