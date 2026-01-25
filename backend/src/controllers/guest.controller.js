import Guest from "../models/guest.model.js";
import Wedding from "../models/wedding.model.js";

export const createGuest = async (req, res) => {
  try {
    const { weddingId } = req.params;
    
    // Verify wedding ownership
    const wedding = await Wedding.findOne({
      _id: weddingId,
      createdBy: req.user._id,
    });
    if (!wedding) return res.status(404).json({ message: "Wedding not found" });

    const guest = new Guest({
      ...req.body,
      weddingId,
    });
    await guest.save();
    res.status(201).json(guest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getGuests = async (req, res) => {
  try {
    const { weddingId } = req.params;
    
    // Verify wedding ownership
    const wedding = await Wedding.findOne({
      _id: weddingId,
      createdBy: req.user._id,
    });
    if (!wedding) return res.status(404).json({ message: "Wedding not found" });

    const guests = await Guest.find({ weddingId });
    res.json(guests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateGuest = async (req, res) => {
  try {
    const { weddingId, guestId } = req.params;
    
    // Verify wedding ownership
    const wedding = await Wedding.findOne({
      _id: weddingId,
      createdBy: req.user._id,
    });
    if (!wedding) return res.status(404).json({ message: "Wedding not found" });

    const guest = await Guest.findOneAndUpdate(
      { _id: guestId, weddingId },
      req.body,
      { new: true }
    );
    if (!guest) return res.status(404).json({ message: "Guest not found" });
    res.json(guest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteGuest = async (req, res) => {
  try {
    const { weddingId, guestId } = req.params;
    
    // Verify wedding ownership
    const wedding = await Wedding.findOne({
      _id: weddingId,
      createdBy: req.user._id,
    });
    if (!wedding) return res.status(404).json({ message: "Wedding not found" });

    const guest = await Guest.findOneAndDelete({ _id: guestId, weddingId });
    if (!guest) return res.status(404).json({ message: "Guest not found" });
    res.json({ message: "Guest deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};