import pool from "../config/database.js";
import { hashPassword, verifyPassword } from "../utils/password.js";
import { generateToken } from "../utils/jwt.js";

// ユーザー登録
export const register = async (req, res) => {
  try {
    const { username, password, full_name } = req.body;

    // バリデーション
    if (!username || !password || !full_name) {
      return res
        .status(400)
        .json({ message: "Username, password, and full name are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    // ユーザー名が既に登録されているかチェック
    const [existingUser] = await pool.query(
      "SELECT user_id FROM users WHERE username = ?",
      [username],
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ message: "Username already registered" });
    }

    // パスワードをハッシュ化
    const password_hash = await hashPassword(password);

    // ユーザーを作成
    const [result] = await pool.query(
      "INSERT INTO users (username, password_hash, full_name) VALUES (?, ?, ?)",
      [username, password_hash, full_name],
    );

    res.status(201).json({
      message: "User registered successfully",
      user: {
        user_id: result.insertId,
        username,
        full_name,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Error registering user" });
  }
};

// ユーザーログイン
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // バリデーション
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    // ユーザーを取得
    const [users] = await pool.query(
      "SELECT user_id, username, password_hash, full_name FROM users WHERE username = ?",
      [username],
    );

    if (users.length === 0) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const user = users[0];

    // パスワードを検証
    const isPasswordValid = await verifyPassword(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // JWTトークンを生成
    const token = generateToken(user.user_id, user.username);

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        user_id: user.user_id,
        username: user.username,
        full_name: user.full_name,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Error logging in" });
  }
};
