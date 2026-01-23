import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
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
    datetime: { 
        type: Date, 
        required: true 
    },
    venue: String,
    dressCode: String,
    invitedGuestIds: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Guest" }
    ],
    vendorIds: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("Event", eventSchema);
