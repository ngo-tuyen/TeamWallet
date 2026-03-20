import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { checkTeamMember } from "../middleware/roleCheck.js";
import { getTeamSummary } from "../controllers/dashboardController.js";

const router = express.Router({ mergeParams: true });

// 月間サマリー取得 (メンバーのみ)
router.get("/summary", authMiddleware, checkTeamMember, getTeamSummary);

export default router;
