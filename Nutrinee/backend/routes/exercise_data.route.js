import express from "express";

import { getExerciseData, getOneExerciseData, updateExerciseData } from "../controllers/exercise_data.controller.js";

const router = express.Router();

router.get("/:userId", getExerciseData);
router.get("/last/:userId", getOneExerciseData);
router.patch("/:userId", updateExerciseData);

export default router;