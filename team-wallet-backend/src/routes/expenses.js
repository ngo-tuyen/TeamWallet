import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import {
  checkTeamAdminOrManager,
  checkTeamMember,
} from "../middleware/roleCheck.js";
import {
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
} from "../controllers/expenseController.js";

const router = express.Router({ mergeParams: true });

// 支出作成 (管理者/マネージャーのみ)
router.post("/", authMiddleware, checkTeamAdminOrManager, createExpense);

// 支出一覧取得 (メンバーのみ)
router.get("/", authMiddleware, checkTeamMember, getExpenses);

// 支出更新 (管理者/マネージャーのみ)
router.put(
  "/:expense_id",
  authMiddleware,
  checkTeamAdminOrManager,
  updateExpense,
);

// 支出削除 (管理者/マネージャーのみ)
router.delete(
  "/:expense_id",
  authMiddleware,
  checkTeamAdminOrManager,
  deleteExpense,
);

export default router;
