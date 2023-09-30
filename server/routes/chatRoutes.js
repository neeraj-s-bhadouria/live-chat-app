import express from "express";
import authorize from "../middleware/authMiddleware.js";
import { HOME, GROUP, ADD, REMOVE, RENAME } from "../constants.js";
import {
  createChat,
  getAllChats,
  createGroup,
  addToGroup,
  removeFromGroup,
  renameGroup,
} from "../controllers/chatController.js";

const router = express.Router();

router.route(HOME).post(authorize, createChat).get(authorize, getAllChats);
router.post(GROUP, authorize, createGroup);
router.put(GROUP + ADD, authorize, addToGroup);
router.put(GROUP + REMOVE, authorize, removeFromGroup);
router.put(GROUP + RENAME, authorize, renameGroup);

export default router;
