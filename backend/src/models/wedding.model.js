import mongoose from "mongoose";

const weddingSchema = new mongoose.Schema(
  {
    title: { 
        type: String, 
        required: true 
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    startDate: Date,
    endDate: Date,
    location: String,
  },
  { timestamps: true },
);

export default mongoose.model("Wedding", weddingSchema);
