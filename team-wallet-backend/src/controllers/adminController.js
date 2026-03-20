import pool from "../config/database.js";

// システム統計を取得
export const getSystemStats = async (req, res) => {
  try {
    // 総チーム数
    const [teamStats] = await pool.query(
      "SELECT COUNT(*) as total_teams FROM teams",
    );

    // 総ユーザー数
    const [userStats] = await pool.query(
      "SELECT COUNT(*) as total_users FROM users",
    );

    // アクティブなチーム数 (過去30日間に記録がある)
    const [activeTeams] = await pool.query(
      `SELECT COUNT(DISTINCT team_id) as active_teams
       FROM (
         SELECT team_id FROM incomes WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
         UNION
         SELECT team_id FROM expenses WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
       ) as recent_activity`,
    );

    res.status(200).json({
      total_teams: teamStats[0].total_teams,
      total_users: userStats[0].total_users,
      active_teams: activeTeams[0].active_teams,
    });
  } catch (error) {
    console.error("Get system stats error:", error);
    res.status(500).json({ message: "Error fetching system statistics" });
  }
};

// 全チーム一覧を取得
export const getAllTeams = async (req, res) => {
  try {
    // 全チーム一覧を取得 (メンバー数含む)
    const [teams] = await pool.query(
      `SELECT t.team_id, t.team_name, t.admin_id, u.full_name as admin_name, 
              COUNT(tm.member_id) as member_count, t.created_at
       FROM teams t
       INNER JOIN users u ON t.admin_id = u.user_id
       LEFT JOIN team_members tm ON t.team_id = tm.team_id
       GROUP BY t.team_id
       ORDER BY t.created_at DESC`,
    );

    res.status(200).json(teams);
  } catch (error) {
    console.error("Get all teams error:", error);
    res.status(500).json({ message: "Error fetching teams" });
  }
};

// チームを削除 (Super Admin用)
export const deleteTeamAsAdmin = async (req, res) => {
  try {
    const { team_id } = req.params;

    // チームが存在するかチェック
    const [teams] = await pool.query(
      "SELECT team_id FROM teams WHERE team_id = ?",
      [team_id],
    );

    if (teams.length === 0) {
      return res.status(404).json({ message: "Team not found" });
    }

    // チームを削除 (関連データは自動削除 - ON DELETE CASCADE)
    await pool.query("DELETE FROM teams WHERE team_id = ?", [team_id]);

    res.status(200).json({ message: "Team deleted successfully" });
  } catch (error) {
    console.error("Delete team as admin error:", error);
    res.status(500).json({ message: "Error deleting team" });
  }
};
