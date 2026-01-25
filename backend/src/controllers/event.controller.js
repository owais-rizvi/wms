import Event from "../models/event.model.js";
import Wedding from "../models/wedding.model.js";

export const createEvent = async (req, res) => {
  try {
    const { weddingId } = req.params;
    const wedding = await Wedding.findOne({ _id: weddingId, createdBy: req.user._id });
    if (!wedding) return res.status(404).json({ message: "Wedding not found" });

    const event = new Event({ ...req.body, weddingId });
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getEvents = async (req, res) => {
  try {
    const { weddingId } = req.params;
    const wedding = await Wedding.findOne({ _id: weddingId, createdBy: req.user._id });
    if (!wedding) return res.status(404).json({ message: "Wedding not found" });

    const events = await Event.find({ weddingId });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const { weddingId, eventId } = req.params;
    const wedding = await Wedding.findOne({ _id: weddingId, createdBy: req.user._id });
    if (!wedding) return res.status(404).json({ message: "Wedding not found" });

    const event = await Event.findOneAndUpdate({ _id: eventId, weddingId }, req.body, { new: true });
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const { weddingId, eventId } = req.params;
    const wedding = await Wedding.findOne({ _id: weddingId, createdBy: req.user._id });
    if (!wedding) return res.status(404).json({ message: "Wedding not found" });

    const event = await Event.findOneAndDelete({ _id: eventId, weddingId });
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json({ message: "Event deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};