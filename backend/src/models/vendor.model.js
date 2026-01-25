import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    contact: String,
    email: String,
    cost: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["contacted", "booked", "paid"],
      default: "contacted",
    },
    weddingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wedding",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Vendor", vendorSchema);