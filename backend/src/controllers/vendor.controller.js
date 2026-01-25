import Vendor from "../models/vendor.model.js";
import Wedding from "../models/wedding.model.js";

export const createVendor = async (req, res) => {
  try {
    const { weddingId } = req.params;
    const wedding = await Wedding.findOne({ _id: weddingId, createdBy: req.user._id });
    if (!wedding) return res.status(404).json({ message: "Wedding not found" });

    const vendor = new Vendor({ ...req.body, weddingId });
    await vendor.save();
    res.status(201).json(vendor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getVendors = async (req, res) => {
  try {
    const { weddingId } = req.params;
    const wedding = await Wedding.findOne({ _id: weddingId, createdBy: req.user._id });
    if (!wedding) return res.status(404).json({ message: "Wedding not found" });

    const vendors = await Vendor.find({ weddingId });
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateVendor = async (req, res) => {
  try {
    const { weddingId, vendorId } = req.params;
    const wedding = await Wedding.findOne({ _id: weddingId, createdBy: req.user._id });
    if (!wedding) return res.status(404).json({ message: "Wedding not found" });

    const vendor = await Vendor.findOneAndUpdate({ _id: vendorId, weddingId }, req.body, { new: true });
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });
    res.json(vendor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteVendor = async (req, res) => {
  try {
    const { weddingId, vendorId } = req.params;
    const wedding = await Wedding.findOne({ _id: weddingId, createdBy: req.user._id });
    if (!wedding) return res.status(404).json({ message: "Wedding not found" });

    const vendor = await Vendor.findOneAndDelete({ _id: vendorId, weddingId });
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });
    res.json({ message: "Vendor deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};