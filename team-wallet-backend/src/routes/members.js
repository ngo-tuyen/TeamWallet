import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { checkTeamAdmin, checkTeamMember } from "../middleware/roleCheck.js";
import {
  addMember,
  getMembers,
  updateMemberRole,
  removeMember,
} from "../controllers/memberController.js";

const router = express.Router({ mergeParams: true });

// メンバー追加 (管理者のみ)
router.post("/", authMiddleware, checkTeamAdmin, addMember);

// メンバー一覧取得 (メンバーのみ)
router.get("/", authMiddleware, checkTeamMember, getMembers);

// メンバーのロール変更 (管理者のみ)
router.put("/:member_id", authMiddleware, checkTeamAdmin, updateMemberRole);

// メンバー削除 (管理者のみ)
router.delete("/:member_id", authMiddleware, checkTeamAdmin, removeMember);

export default router;
