import express from "express";

import { createUserInfo, deleteUserInfo, getUserInfo, updateUserInfo, getOneUserInfo } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", getUserInfo);
router.get("/:id", getOneUserInfo);
router.post("/", createUserInfo);
router.put("/:id", updateUserInfo);
router.delete("/:id", deleteUserInfo);

export default router;