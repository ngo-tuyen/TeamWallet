import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import {
  searchUsers,
  sendInvitation,
  getMyInvitations,
  acceptInvitation,
  rejectInvitation,
} from "../controllers/invitationController.js";

const router = express.Router();

// ユーザー検索
router.get("/search", authMiddleware, searchUsers);

// 自分の招待を取得
router.get("/my-invitations", authMiddleware, getMyInvitations);

// チーム招待を送信
router.post("/teams/:teamId/invite", authMiddleware, sendInvitation);

// 招待を承認
router.post("/:invitationId/accept", authMiddleware, acceptInvitation);

// 招待を拒否
router.post("/:invitationId/reject", authMiddleware, rejectInvitation);

export default router;
