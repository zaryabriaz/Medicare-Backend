import express from "express";
import {updateUser, getAllUser, getSingleUser, getUserProfile, getMyAppointments } from '../controllers/userController.js';
import { authenticate, restrict } from "../auth/verifyToken.js";
const router = express.Router()


router.get('/:id', authenticate, restrict(['patient']), getSingleUser)
router.get('/', authenticate, restrict(['admin']), getAllUser)
router.put('/:id', authenticate, restrict(['patient']),  updateUser)
router.get('/profile/me', authenticate, restrict(['patient']),  getUserProfile)
router.get('/appointments/my-appointments', authenticate, restrict(['patient']),  getMyAppointments)


// router.delete('/:id', deleteUser)

export default router