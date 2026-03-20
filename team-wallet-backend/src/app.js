import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import teamRoutes from "./routes/teams.js";
import memberRoutes from "./routes/members.js";
import categoryRoutes from "./routes/categories.js";
import incomeRoutes from "./routes/incomes.js";
import expenseRoutes from "./routes/expenses.js";
import dashboardRoutes from "./routes/dashboard.js";
import adminRoutes from "./routes/admin.js";
import invitationRoutes from "./routes/invitations.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();

// ミドルウェア設定
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS設定
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);

// ルート設定
app.use("/api/auth", authRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/teams/:team_id/members", memberRoutes);
app.use("/api/teams/:team_id/categories", categoryRoutes);
app.use("/api/teams/:team_id/incomes", incomeRoutes);
app.use("/api/teams/:team_id/expenses", expenseRoutes);
app.use("/api/teams/:team_id", dashboardRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/invitations", invitationRoutes);

// ヘルスチェック
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Team Wallet API is running" });
});

// 404ハンドラー
app.use(notFoundHandler);

// エラーハンドラー (最後に設定)
app.use(errorHandler);

export default app;
