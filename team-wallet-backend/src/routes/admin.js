import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { checkSuperAdmin } from "../middleware/roleCheck.js";
import {
  getSystemStats,
  getAllTeams,
  deleteTeamAsAdmin,
} from "../controllers/adminController.js";

const router = express.Router();

// システム統計取得 (Super Adminのみ)
router.get("/stats", authMiddleware, checkSuperAdmin, getSystemStats);

// 全チーム一覧取得 (Super Adminのみ)
router.get("/teams", authMiddleware, checkSuperAdmin, getAllTeams);

// チーム削除 (Super Adminのみ)
router.delete(
  "/teams/:team_id",
  authMiddleware,
  checkSuperAdmin,
  deleteTeamAsAdmin,
);

export default router;
