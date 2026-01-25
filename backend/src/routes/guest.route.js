import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  createGuest,
  getGuests,
  updateGuest,
  deleteGuest,
} from "../controllers/guest.controller.js";

const router = express.Router();

router.use(protectRoute);

router.post("/:weddingId/guests", createGuest);
router.get("/:weddingId/guests", getGuests);
router.put("/:weddingId/guests/:guestId", updateGuest);
router.delete("/:weddingId/guests/:guestId", deleteGuest);

export default router;