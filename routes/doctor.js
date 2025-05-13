import express from "express";
import {updateDoctor, getAllDoctor, getSingleDoctor } from '../controllers/doctorController.js';
import { authenticate, restrict } from "../auth/verifyToken.js";
import reviewRouter from './review.js'

const router = express.Router()

//nested routes

router.use("/:doctorId/reviews", reviewRouter)
router.get('/:id', getSingleDoctor)
router.get('/', getAllDoctor)
router.put('/:id', authenticate, restrict(['doctor']), updateDoctor)
// router.delete('/:id', deleteDoctor)

export default router