import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema(
  {
    weddingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wedding",
      required: true
    },
    name: { type: String, required: true },
    serviceType: {
      type: String,
      enum: ["catering", "photography", "decor", "music", "transport"],
      required: true
    },
    contactPhone: String,
    contactEmail: String,
    linkedUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "partial", "paid"],
      default: "pending"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Vendor", vendorSchema);
