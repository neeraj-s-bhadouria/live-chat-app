import express from "express";
import {
  registerUser,
  loginUser,
  getAllUsers,
} from "../controllers/userController.js";
import { LOGIN, USERS, HOME } from "../constants.js";

const router = express.Router();

router.post(HOME, registerUser);
router.post(LOGIN, loginUser);
router.get(USERS, getAllUsers);

export default router;
