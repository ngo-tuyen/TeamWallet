import pool from "../config/database.js";

// ユーザー名で検索
export const searchUsers = async (req, res) => {
  try {
    const { username } = req.query;

    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

    const [users] = await pool.query(
      "SELECT user_id, username, full_name FROM users WHERE username LIKE ? LIMIT 10",
      [`%${username}%`],
    );

    res.status(200).json(users);
  } catch (error) {
    console.error("Search users error:", error);
    res.status(500).json({ message: "Error searching users" });
  }
};

// チーム招待を送信
export const sendInvitation = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { user_id, role } = req.body;
    const invitedBy = req.user.user_id;

    // バリデーション
    if (!user_id || !role) {
      return res.status(400).json({ message: "User ID and role are required" });
    }

    // ロールが有効かチェック (adminは許可しない)
    if (!["user", "manager"].includes(role)) {
      return res
        .status(400)
        .json({ message: "Invalid role. Only user and manager are allowed" });
    }

    // ユーザーがチームに既に参加しているかチェック
    const [existingMember] = await pool.query(
      "SELECT member_id FROM team_members WHERE team_id = ? AND user_id = ?",
      [teamId, user_id],
    );

    if (existingMember.length > 0) {
      return res
        .status(400)
        .json({ message: "User is already a member of this team" });
    }

    // 既存の招待を全て削除 (ステータス関係なく)
    await pool.query(
      "DELETE FROM invitations WHERE team_id = ? AND user_id = ?",
      [teamId, user_id],
    );

    // 招待を作成
    const [result] = await pool.query(
      "INSERT INTO invitations (team_id, user_id, invited_by, role, status) VALUES (?, ?, ?, ?, ?)",
      [teamId, user_id, invitedBy, role, "pending"],
    );

    res.status(201).json({
      message: "Invitation sent successfully",
      invitation: {
        invitation_id: result.insertId,
        team_id: teamId,
        user_id: user_id,
        role,
        status: "pending",
      },
    });
  } catch (error) {
    console.error("Send invitation error:", error);
    res.status(500).json({ message: "Error sending invitation" });
  }
};

// ユーザーが受け取った招待を取得
export const getMyInvitations = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const [invitations] = await pool.query(
      `SELECT i.*, t.team_name, u.username as invited_by_username
       FROM invitations i
       JOIN teams t ON i.team_id = t.team_id
       JOIN users u ON i.invited_by = u.user_id
       WHERE i.user_id = ? AND i.status = 'pending'
       ORDER BY i.created_at DESC`,
      [userId],
    );

    res.status(200).json(invitations);
  } catch (error) {
    console.error("Get invitations error:", error);
    res.status(500).json({ message: "Error fetching invitations" });
  }
};

// 招待を承認
export const acceptInvitation = async (req, res) => {
  try {
    const { invitationId } = req.params;
    const userId = req.user.user_id;

    console.log(`Accepting invitation ${invitationId} for user ${userId}`);

    // 招待を取得
    const [invitations] = await pool.query(
      "SELECT * FROM invitations WHERE invitation_id = ? AND user_id = ?",
      [invitationId, userId],
    );

    if (invitations.length === 0) {
      console.log(`Invitation ${invitationId} not found`);
      return res.status(404).json({ message: "Invitation not found" });
    }

    const invitation = invitations[0];
    console.log(`Invitation found:`, invitation);

    if (invitation.status !== "pending") {
      console.log(`Invitation status is ${invitation.status}, not pending`);
      return res
        .status(400)
        .json({ message: "Invitation is no longer pending" });
    }

    // チームメンバーを追加
    try {
      console.log(
        `Adding user ${userId} to team ${invitation.team_id} with role ${invitation.role}`,
      );
      await pool.query(
        "INSERT INTO team_members (user_id, team_id, role) VALUES (?, ?, ?)",
        [userId, invitation.team_id, invitation.role],
      );
      console.log(`Successfully added member`);
    } catch (insertError) {
      console.log(`Insert error:`, insertError.message);
      // User might already be member, continue anyway
    }

    // 招待を削除
    try {
      console.log(`Deleting invitation ${invitationId}`);
      await pool.query("DELETE FROM invitations WHERE invitation_id = ?", [
        invitationId,
      ]);
      console.log(`Successfully deleted invitation`);
    } catch (deleteError) {
      console.log(`Delete error:`, deleteError.message);
      throw deleteError;
    }

    res.status(200).json({ message: "Invitation accepted" });
  } catch (error) {
    console.error("Accept invitation error:", error);
    res.status(500).json({ message: "Error accepting invitation" });
  }
};

// 招待を拒否
export const rejectInvitation = async (req, res) => {
  try {
    const { invitationId } = req.params;
    const userId = req.user.user_id;

    // 招待を取得
    const [invitations] = await pool.query(
      "SELECT * FROM invitations WHERE invitation_id = ? AND user_id = ?",
      [invitationId, userId],
    );

    if (invitations.length === 0) {
      return res.status(404).json({ message: "Invitation not found" });
    }

    if (invitations[0].status !== "pending") {
      return res
        .status(400)
        .json({ message: "Invitation is no longer pending" });
    }

    // 招待を削除
    await pool.query("DELETE FROM invitations WHERE invitation_id = ?", [
      invitationId,
    ]);

    res.status(200).json({ message: "Invitation rejected" });
  } catch (error) {
    console.error("Reject invitation error:", error);
    res.status(500).json({ message: "Error rejecting invitation" });
  }
};
