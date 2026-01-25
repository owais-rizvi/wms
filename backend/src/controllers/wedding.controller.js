import Wedding from "../models/wedding.model.js";

export const createWedding = async (req, res) => {
  try {
    const wedding = new Wedding({
      ...req.body,
      createdBy: req.user._id,
    });
    await wedding.save();
    res.status(201).json(wedding);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getWeddings = async (req, res) => {
  try {
    const weddings = await Wedding.find({ createdBy: req.user._id });
    res.json(weddings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getWedding = async (req, res) => {
  try {
    const wedding = await Wedding.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });
    if (!wedding) return res.status(404).json({ message: "Wedding not found" });
    res.json(wedding);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateWedding = async (req, res) => {
  try {
    const wedding = await Wedding.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      req.body,
      { new: true }
    );
    if (!wedding) return res.status(404).json({ message: "Wedding not found" });
    res.json(wedding);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteWedding = async (req, res) => {
  try {
    const wedding = await Wedding.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id,
    });
    if (!wedding) return res.status(404).json({ message: "Wedding not found" });
    res.json({ message: "Wedding deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};