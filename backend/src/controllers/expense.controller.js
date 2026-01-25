import Expense from "../models/expense.model.js";
import Wedding from "../models/wedding.model.js";

export const createExpense = async (req, res) => {
  try {
    const { weddingId } = req.params;
    const wedding = await Wedding.findOne({ _id: weddingId, createdBy: req.user._id });
    if (!wedding) return res.status(404).json({ message: "Wedding not found" });

    const expense = new Expense({ ...req.body, weddingId });
    await expense.save();
    res.status(201).json(expense);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getExpenses = async (req, res) => {
  try {
    const { weddingId } = req.params;
    const wedding = await Wedding.findOne({ _id: weddingId, createdBy: req.user._id });
    if (!wedding) return res.status(404).json({ message: "Wedding not found" });

    const expenses = await Expense.find({ weddingId });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateExpense = async (req, res) => {
  try {
    const { weddingId, expenseId } = req.params;
    const wedding = await Wedding.findOne({ _id: weddingId, createdBy: req.user._id });
    if (!wedding) return res.status(404).json({ message: "Wedding not found" });

    const expense = await Expense.findOneAndUpdate({ _id: expenseId, weddingId }, req.body, { new: true });
    if (!expense) return res.status(404).json({ message: "Expense not found" });
    res.json(expense);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const { weddingId, expenseId } = req.params;
    const wedding = await Wedding.findOne({ _id: weddingId, createdBy: req.user._id });
    if (!wedding) return res.status(404).json({ message: "Wedding not found" });

    const expense = await Expense.findOneAndDelete({ _id: expenseId, weddingId });
    if (!expense) return res.status(404).json({ message: "Expense not found" });
    res.json({ message: "Expense deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};