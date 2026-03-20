import pool from "../config/database.js";
import dotenv from "dotenv";
dotenv.config();

// ユーザーがチーム管理者かチェック
export const checkTeamAdmin = async (req, res, next) => {
  try {
    const { team_id } = req.params;
    const { user_id } = req.user;

    // ユーザーのチーム内でのロールを確認
    const [rows] = await pool.query(
      "SELECT role FROM team_members WHERE user_id = ? AND team_id = ?",
      [user_id, team_id],
    );

    if (rows.length === 0 || rows[0].role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only team admin can perform this action" });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Error checking team admin role" });
  }
};

// ユーザーがチーム管理者またはマネージャーかチェック
export const checkTeamAdminOrManager = async (req, res, next) => {
  try {
    const { team_id } = req.params;
    const { user_id } = req.user;

    // ユーザーのチーム内でのロールを確認
    const [rows] = await pool.query(
      "SELECT role FROM team_members WHERE user_id = ? AND team_id = ?",
      [user_id, team_id],
    );

    if (rows.length === 0 || !["admin", "manager"].includes(rows[0].role)) {
      return res.status(403).json({
        message: "Only team admin or manager can perform this action",
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Error checking team role" });
  }
};

// ユーザーがチームメンバーかチェック
export const checkTeamMember = async (req, res, next) => {
  try {
    const { team_id } = req.params;
    const { user_id } = req.user;

    // ユーザーがチームに属しているか確認
    const [rows] = await pool.query(
      "SELECT member_id FROM team_members WHERE user_id = ? AND team_id = ?",
      [user_id, team_id],
    );

    if (rows.length === 0) {
      return res
        .status(403)
        .json({ message: "You are not a member of this team" });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Error checking team membership" });
  }
};

// ユーザーがスーパー管理者かチェック
export const checkSuperAdmin = async (req, res, next) => {
  try {
    const { user_id } = req.user;
    const superAdminUsername = process.env.SUPER_ADMIN;

    // ユーザーのユーザー名を確認
    const [rows] = await pool.query(
      "SELECT username FROM users WHERE user_id = ?",
      [user_id],
    );

    if (rows.length === 0 || rows[0].username !== superAdminUsername) {
      return res
        .status(403)
        .json({ message: "Only super admin can perform this action" });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Error checking super admin role" });
  }
};
