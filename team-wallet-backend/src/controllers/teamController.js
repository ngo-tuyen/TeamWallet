import pool from "../config/database.js";

// チームを作成
export const createTeam = async (req, res) => {
  try {
    const { team_name, description } = req.body;
    const { user_id } = req.user;

    // バリデーション
    if (!team_name) {
      return res.status(400).json({ message: "Team name is required" });
    }

    // チームを作成
    const [result] = await pool.query(
      "INSERT INTO teams (team_name, admin_id, description) VALUES (?, ?, ?)",
      [team_name, user_id, description || null],
    );

    const team_id = result.insertId;

    // チーム作成者を管理者として追加
    await pool.query(
      "INSERT INTO team_members (user_id, team_id, role) VALUES (?, ?, ?)",
      [user_id, team_id, "admin"],
    );

    res.status(201).json({
      message: "Team created successfully",
      team: {
        team_id,
        team_name,
        admin_id: user_id,
        description: description || null,
      },
    });
  } catch (error) {
    console.error("Create team error:", error);
    res.status(500).json({ message: "Error creating team" });
  }
};

// ユーザーが属するチーム一覧を取得
export const getTeams = async (req, res) => {
  try {
    const { user_id } = req.user;

    // ユーザーが属するチーム一覧を取得
    const [teams] = await pool.query(
      `SELECT t.team_id, t.team_name, t.admin_id, t.description, t.created_at,
              COUNT(tm.member_id) as member_count
       FROM teams t
       INNER JOIN team_members tm ON t.team_id = tm.team_id
       WHERE tm.user_id = ?
       GROUP BY t.team_id
       ORDER BY t.created_at DESC`,
      [user_id],
    );

    res.status(200).json(teams);
  } catch (error) {
    console.error("Get teams error:", error);
    res.status(500).json({ message: "Error fetching teams" });
  }
};

// チーム詳細を取得
export const getTeamDetail = async (req, res) => {
  try {
    const { team_id } = req.params;
    const { user_id } = req.user;

    // ユーザーがチームメンバーかチェック
    const [members] = await pool.query(
      "SELECT member_id FROM team_members WHERE user_id = ? AND team_id = ?",
      [user_id, team_id],
    );

    if (members.length === 0) {
      return res
        .status(403)
        .json({ message: "You are not a member of this team" });
    }

    // チーム情報を取得
    const [teams] = await pool.query("SELECT * FROM teams WHERE team_id = ?", [
      team_id,
    ]);

    if (teams.length === 0) {
      return res.status(404).json({ message: "Team not found" });
    }

    const team = teams[0];

    // チームメンバー一覧を取得
    const [teamMembers] = await pool.query(
      `SELECT tm.member_id, tm.user_id, u.full_name, u.username, tm.role, tm.joined_at
       FROM team_members tm
       INNER JOIN users u ON tm.user_id = u.user_id
       WHERE tm.team_id = ?
       ORDER BY tm.joined_at ASC`,
      [team_id],
    );

    res.status(200).json({
      ...team,
      members: teamMembers,
    });
  } catch (error) {
    console.error("Get team detail error:", error);
    res.status(500).json({ message: "Error fetching team detail" });
  }
};

// チーム情報を更新
export const updateTeam = async (req, res) => {
  try {
    const { team_id } = req.params;
    const { team_name, description } = req.body;

    // バリデーション
    if (!team_name) {
      return res.status(400).json({ message: "Team name is required" });
    }

    // チーム情報を更新
    await pool.query(
      "UPDATE teams SET team_name = ?, description = ? WHERE team_id = ?",
      [team_name, description || null, team_id],
    );

    res.status(200).json({ message: "Team updated successfully" });
  } catch (error) {
    console.error("Update team error:", error);
    res.status(500).json({ message: "Error updating team" });
  }
};

// チームを削除
export const deleteTeam = async (req, res) => {
  try {
    const { team_id } = req.params;

    // チームを削除 (関連データは自動削除 - ON DELETE CASCADE)
    await pool.query("DELETE FROM teams WHERE team_id = ?", [team_id]);

    res.status(200).json({ message: "Team deleted successfully" });
  } catch (error) {
    console.error("Delete team error:", error);
    res.status(500).json({ message: "Error deleting team" });
  }
};
