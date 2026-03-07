import api from "./api.js";

// ユーザー名で検索
export const searchUsers = async (username) => {
  try {
    const response = await api.get("/invitations/search", {
      params: { username },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to search users" };
  }
};

// チーム招待を送信
export const sendInvitation = async (teamId, userId, role) => {
  try {
    const response = await api.post(`/invitations/teams/${teamId}/invite`, {
      user_id: userId,
      role,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to send invitation" };
  }
};

// 自分の招待を取得
export const getMyInvitations = async () => {
  try {
    const response = await api.get("/invitations/my-invitations");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch invitations" };
  }
};

// 招待を承認
export const acceptInvitation = async (invitationId) => {
  try {
    const response = await api.post(`/invitations/${invitationId}/accept`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to accept invitation" };
  }
};

// 招待を拒否
export const rejectInvitation = async (invitationId) => {
  try {
    const response = await api.post(`/invitations/${invitationId}/reject`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to reject invitation" };
  }
};
