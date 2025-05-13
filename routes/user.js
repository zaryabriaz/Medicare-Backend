import express from "express";
import {updateUser, getAllUser, getSingleUser } from '../controllers/userController.js';
import { authenticate, restrict } from "../auth/verifyToken.js";
const router = express.Router()


router.get('/:id', authenticate, restrict(['patient']), getSingleUser)
router.get('/', authenticate, restrict(['admin']), getAllUser)
router.put('/:id', authenticate, restrict(['patient']),  updateUser)
// router.delete('/:id', deleteUser)

export default router