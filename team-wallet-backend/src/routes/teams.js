import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { checkTeamAdmin, checkTeamMember } from "../middleware/roleCheck.js";
import {
  createTeam,
  getTeams,
  getTeamDetail,
  updateTeam,
  deleteTeam,
} from "../controllers/teamController.js";

const router = express.Router();

// チーム作成 (認証必須)
router.post("/", authMiddleware, createTeam);

// チーム一覧取得 (認証必須)
router.get("/", authMiddleware, getTeams);

// チーム詳細取得 (メンバーのみ)
router.get("/:team_id", authMiddleware, checkTeamMember, getTeamDetail);

// チーム更新 (管理者のみ)
router.put("/:team_id", authMiddleware, checkTeamAdmin, updateTeam);

// チーム削除 (管理者のみ)
router.delete("/:team_id", authMiddleware, checkTeamAdmin, deleteTeam);

export default router;
