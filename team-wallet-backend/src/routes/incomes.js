import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import {
  checkTeamAdminOrManager,
  checkTeamMember,
} from "../middleware/roleCheck.js";
import {
  createIncome,
  getIncomes,
  updateIncome,
  deleteIncome,
} from "../controllers/incomeController.js";

const router = express.Router({ mergeParams: true });

// 収入作成 (管理者/マネージャーのみ)
router.post("/", authMiddleware, checkTeamAdminOrManager, createIncome);

// 収入一覧取得 (メンバーのみ)
router.get("/", authMiddleware, checkTeamMember, getIncomes);

// 収入更新 (管理者/マネージャーのみ)
router.put(
  "/:income_id",
  authMiddleware,
  checkTeamAdminOrManager,
  updateIncome,
);

// 収入削除 (管理者/マネージャーのみ)
router.delete(
  "/:income_id",
  authMiddleware,
  checkTeamAdminOrManager,
  deleteIncome,
);

export default router;
