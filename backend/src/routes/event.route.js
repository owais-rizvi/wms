import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { createEvent, getEvents, updateEvent, deleteEvent } from "../controllers/event.controller.js";

const router = express.Router();
router.use(protectRoute);

router.post("/:weddingId/events", createEvent);
router.get("/:weddingId/events", getEvents);
router.put("/:weddingId/events/:eventId", updateEvent);
router.delete("/:weddingId/events/:eventId", deleteEvent);

export default router;