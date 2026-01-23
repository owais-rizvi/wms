import mongoose from "mongoose";

const guestSchema = new mongoose.Schema(
  {
    weddingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wedding",
      required: true
    },
    name: { 
        type: String, 
        required: true 
    },
    phone: String,
    email: String,
    rsvpStatus: {
      type: String,
      enum: ["pending", "accepted", "declined"],
      default: "pending"
    },
    count: {
        type: Number,
        required: true,
        min: 1
    },
    linkedUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false
    }
  },
  { timestamps: true }
);

export default mongoose.model("Guest", guestSchema);
