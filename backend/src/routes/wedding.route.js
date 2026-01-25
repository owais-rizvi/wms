import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  createWedding,
  getWeddings,
  getWedding,
  updateWedding,
  deleteWedding,
} from "../controllers/wedding.controller.js";

const router = express.Router();

router.use(protectRoute);

router.post("/", createWedding);
router.get("/", getWeddings);
router.get("/:id", getWedding);
router.put("/:id", updateWedding);
router.delete("/:id", deleteWedding);

export default router;