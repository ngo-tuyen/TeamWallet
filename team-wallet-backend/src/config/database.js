import mysql from "mysql2/promise.js";
import dotenv from "dotenv";

dotenv.config();

// MySQL コネクションプールを作成
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelayMs: 0,
});

// データベース接続をテスト
pool
  .getConnection()
  .then((conn) => {
    console.log("[Success] Database connected successfully");
    conn.release();
  })
  .catch((err) => {
    console.error("[failed] Database connection failed:", err.message);
    process.exit(1);
  });

export default pool;
