import mongoose from "mongoose";

const guestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: String,
    phone: String,
    rsvpStatus: {
      type: String,
      enum: ["pending", "confirmed", "declined"],
      default: "pending",
    },
    plusOne: {
      type: Boolean,
      default: false,
    },
    weddingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wedding",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Guest", guestSchema);