import mysql from "mysql2/promise.js";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { hashPassword } from "../src/utils/password.js";

dotenv.config();

// データベースを初期化
const initializeDatabase = async () => {
  try {
    console.log("Initializing database...");

    // スキーマ作成用のコネクションを作成
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });

    // スキーマファイルを読み込んで実行
    const schemaPath = path.join(process.cwd(), "database", "schema.sql");
    const schema = fs.readFileSync(schemaPath, "utf-8");

    // スキーマをステートメントに分割
    const statements = schema
      .split(";")
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt.length > 0);

    // 各ステートメントを実行
    for (const statement of statements) {
      try {
        await connection.query(statement);
      } catch (error) {
        console.warn(
          `[warning] Statement failed (might be OK if table exists): ${error.message.substring(0, 50)}`,
        );
      }
    }

    console.log("[Success]Database tables created");

    // データベースを選択
    await connection.query(`USE ${process.env.DB_NAME}`);

    // スーパー管理者ユーザーを作成
    const superAdminUsername = process.env.SUPER_ADMIN;
    const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD;

    // スーパー管理者が既に存在するかチェック
    const [existingAdmin] = await connection.query(
      "SELECT user_id FROM users WHERE username = ?",
      [superAdminUsername],
    );

    if (existingAdmin.length === 0) {
      const hashedPassword = await hashPassword(superAdminPassword);

      await connection.query(
        "INSERT INTO users (username, password_hash, full_name) VALUES (?, ?, ?)",
        [superAdminUsername, hashedPassword, "Super Admin"],
      );

      console.log(`[Success]Super admin user created: ${superAdminUsername}`);
    } else {
      console.log(
        `[warning]Super admin user already exists: ${superAdminUsername}`,
      );
    }

    await connection.end();
    console.log("[Success]Database initialization completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("[failed]Error initializing database:", error.message);
    process.exit(1);
  }
};

initializeDatabase();
