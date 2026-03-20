import dotenv from "dotenv";
import app from "./src/app.js";
import pool from "./src/config/database.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

// サーバーを起動
app.listen(PORT, () => {
  console.log(`[success] Team Wallet API running on port ${PORT}`);
  console.log(
    `[success] Environment: ${process.env.NODE_ENV || "development"}`,
  );
});

// グレースフルシャットダウン
process.on("SIGINT", async () => {
  console.log("\n[success] Shutting down gracefully...");
  await pool.end();
  process.exit(0);
});
