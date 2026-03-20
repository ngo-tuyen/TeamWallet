import pool from "../config/database.js";

// チームにメンバーを追加
export const addMember = async (req, res) => {
  try {
    const { team_id } = req.params;
    const { user_id, role } = req.body;

    // バリデーション
    if (!user_id || !role) {
      return res.status(400).json({ message: "User ID and role are required" });
    }

    if (!["admin", "manager", "user"].includes(role)) {
      return res
        .status(400)
        .json({ message: "Invalid role. Must be admin, manager, or user" });
    }

    // ユーザーが存在するかチェック
    const [users] = await pool.query(
      "SELECT user_id FROM users WHERE user_id = ?",
      [user_id],
    );

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // チームが存在するかチェック
    const [teams] = await pool.query(
      "SELECT team_id FROM teams WHERE team_id = ?",
      [team_id],
    );

    if (teams.length === 0) {
      return res.status(404).json({ message: "Team not found" });
    }

    // メンバーが既に存在するかチェック
    const [existingMember] = await pool.query(
      "SELECT member_id FROM team_members WHERE user_id = ? AND team_id = ?",
      [user_id, team_id],
    );

    if (existingMember.length > 0) {
      return res
        .status(400)
        .json({ message: "User is already a member of this team" });
    }

    // メンバーを追加
    const [result] = await pool.query(
      "INSERT INTO team_members (user_id, team_id, role) VALUES (?, ?, ?)",
      [user_id, team_id, role],
    );

    res.status(201).json({
      message: "Member added successfully",
      member: {
        member_id: result.insertId,
        user_id,
        team_id,
        role,
      },
    });
  } catch (error) {
    console.error("Add member error:", error);
    res.status(500).json({ message: "Error adding member" });
  }
};

// チームメンバー一覧を取得
export const getMembers = async (req, res) => {
  try {
    const { team_id } = req.params;

    // メンバー一覧を取得
    const [members] = await pool.query(
      `SELECT tm.member_id, tm.user_id, u.full_name, u.username, tm.role, tm.joined_at
       FROM team_members tm
       INNER JOIN users u ON tm.user_id = u.user_id
       WHERE tm.team_id = ?
       ORDER BY tm.joined_at ASC`,
      [team_id],
    );

    res.status(200).json(members);
  } catch (error) {
    console.error("Get members error:", error);
    res.status(500).json({ message: "Error fetching members" });
  }
};

// メンバーのロールを変更
export const updateMemberRole = async (req, res) => {
  try {
    const { team_id, member_id } = req.params;
    const { role } = req.body;

    // バリデーション
    if (!role) {
      return res.status(400).json({ message: "Role is required" });
    }

    if (!["admin", "manager", "user"].includes(role)) {
      return res
        .status(400)
        .json({ message: "Invalid role. Must be admin, manager, or user" });
    }

    // メンバーが存在するかチェック
    const [members] = await pool.query(
      "SELECT user_id FROM team_members WHERE member_id = ? AND team_id = ?",
      [member_id, team_id],
    );

    if (members.length === 0) {
      return res.status(404).json({ message: "Member not found" });
    }

    const memberUserId = members[0].user_id;

    // チームの管理者を取得
    const [teams] = await pool.query(
      "SELECT admin_id FROM teams WHERE team_id = ?",
      [team_id],
    );

    if (teams.length === 0) {
      return res.status(404).json({ message: "Team not found" });
    }

    const teamAdminId = teams[0].admin_id;

    // チーム作成者(admin)は自分のロールを変更できない
    if (memberUserId === teamAdminId) {
      return res
        .status(403)
        .json({ message: "Team creator cannot change their own role" });
    }

    // メンバーのロールを変更
    await pool.query(
      "UPDATE team_members SET role = ? WHERE member_id = ? AND team_id = ?",
      [role, member_id, team_id],
    );

    res.status(200).json({ message: "Member role updated successfully" });
  } catch (error) {
    console.error("Update member role error:", error);
    res.status(500).json({ message: "Error updating member role" });
  }
};

// メンバーを削除
export const removeMember = async (req, res) => {
  try {
    const { team_id, member_id } = req.params;

    // メンバーが存在するかチェック
    const [members] = await pool.query(
      "SELECT user_id FROM team_members WHERE member_id = ? AND team_id = ?",
      [member_id, team_id],
    );

    if (members.length === 0) {
      return res.status(404).json({ message: "Member not found" });
    }

    // メンバーを削除
    await pool.query(
      "DELETE FROM team_members WHERE member_id = ? AND team_id = ?",
      [member_id, team_id],
    );

    res.status(200).json({ message: "Member removed successfully" });
  } catch (error) {
    console.error("Remove member error:", error);
    res.status(500).json({ message: "Error removing member" });
  }
};
