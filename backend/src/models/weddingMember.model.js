import mongoose from "mongoose";

const weddingMemberSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    weddingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wedding",
      required: true
    },
    role: {
      type: String,
      enum: ["admin", "planner", "family"],
      required: true
    },
    permissions: {
      type: [String],
      default: []
    }
  },
  { timestamps: true }
);

weddingMemberSchema.index({ userId: 1, weddingId: 1 }, { unique: true });

export default mongoose.model("WeddingMember", weddingMemberSchema);
