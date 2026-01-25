import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { createExpense, getExpenses, updateExpense, deleteExpense } from "../controllers/expense.controller.js";

const router = express.Router();
router.use(protectRoute);

router.post("/:weddingId/expenses", createExpense);
router.get("/:weddingId/expenses", getExpenses);
router.put("/:weddingId/expenses/:expenseId", updateExpense);
router.delete("/:weddingId/expenses/:expenseId", deleteExpense);

export default router;