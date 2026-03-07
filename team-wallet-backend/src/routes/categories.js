import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { checkTeamAdmin, checkTeamMember } from "../middleware/roleCheck.js";
import {
  createCategory,
  getCategories,
  deleteCategory,
} from "../controllers/categoryController.js";

const router = express.Router({ mergeParams: true });

// カテゴリー作成 (管理者のみ)
router.post("/", authMiddleware, checkTeamAdmin, createCategory);

// カテゴリー一覧取得 (メンバーのみ)
router.get("/", authMiddleware, checkTeamMember, getCategories);

// カテゴリー削除 (管理者のみ)
router.delete("/:category_id", authMiddleware, checkTeamAdmin, deleteCategory);

export default router;
