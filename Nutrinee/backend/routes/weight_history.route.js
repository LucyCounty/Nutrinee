import express from "express";

import { getWeightHistory, getOneWeightHistory, updateWeightHistory } from "../controllers/weight_history.controller.js";

const router = express.Router();

router.get("/:userId", getWeightHistory);
router.get("/last/:userId", getOneWeightHistory);
router.patch("/:userId", updateWeightHistory);

export default router;