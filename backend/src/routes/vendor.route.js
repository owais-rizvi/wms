import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { createVendor, getVendors, updateVendor, deleteVendor } from "../controllers/vendor.controller.js";

const router = express.Router();
router.use(protectRoute);

router.post("/:weddingId/vendors", createVendor);
router.get("/:weddingId/vendors", getVendors);
router.put("/:weddingId/vendors/:vendorId", updateVendor);
router.delete("/:weddingId/vendors/:vendorId", deleteVendor);

export default router;