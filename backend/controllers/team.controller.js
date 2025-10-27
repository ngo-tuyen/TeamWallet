const db = require("../db");

exports.getMyTeams = async (req, res) => {
  try {
    const userId = req.user.userId;
    const [teams] = await db.query(
      "SELECT t.id, t.name FROM teams t JOIN team_members tm ON t.id = tm.team_id WHERE tm.user_id = ?",
      [userId]
    );
    res.json({ teams });
  } catch (err) {
    console.error("Get teams error:", err.message);
    res.status(500).json({ error: "Failed to fetch teams" });
  }
};

exports.createTeam = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user.userId;

    if (!name) return res.status(400).json({ error: "Team name is required" });

    // Create team with creator info
    const [teamResult] = await db.query(
      "INSERT INTO teams (name, created_by) VALUES (?, ?)",
      [name, userId]
    );
    const teamId = teamResult.insertId;

    // Add creator to team_members with role 'admin'
    await db.query(
      "INSERT INTO team_members (team_id, user_id, role) VALUES (?, ?, ?)",
      [teamId, userId, "admin"]
    );

    res.status(201).json({
      message: "Team created successfully",
      team: { id: teamId, name, created_by: userId },
    });
  } catch (err) {
    console.error("❌ Create team error:", err.message);
    res.status(500).json({ error: "Failed to create team" });
  }
};
