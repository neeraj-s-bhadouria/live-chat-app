import express from "express";
import {
  registerUser,
  loginUser,
  getAllUsers,
} from "../controllers/userController.js";
import { LOGIN, HOME } from "../constants.js";
import authorize from "../middleware/authMiddleware.js";

const router = express.Router();

router.route(HOME).post(registerUser).get(authorize, getAllUsers);
router.post(LOGIN, loginUser);

export default router;
