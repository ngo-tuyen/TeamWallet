import express from "express";
import { register, login } from "../controllers/authController.js";

const router = express.Router();

// ユーザー登録エンドポイント
router.post("/register", register);

// ログインエンドポイント
router.post("/login", login);

export default router;
