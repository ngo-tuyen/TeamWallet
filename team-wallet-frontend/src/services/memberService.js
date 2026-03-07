import apiClient from "./api.js";

// チームメンバー一覧を取得
export const getMembers = async (teamId) => {
  try {
    const response = await apiClient.get(`/teams/${teamId}/members`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch members" };
  }
};

// メンバーを追加
export const addMember = async (teamId, userId, role) => {
  try {
    const response = await apiClient.post(`/teams/${teamId}/members`, {
      user_id: userId,
      role,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to add member" };
  }
};

// メンバーのロールを変更
export const updateMemberRole = async (teamId, memberId, role) => {
  try {
    const response = await apiClient.put(
      `/teams/${teamId}/members/${memberId}`,
      { role },
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to update member role" };
  }
};

// メンバーを削除
export const removeMember = async (teamId, memberId) => {
  try {
    const response = await apiClient.delete(
      `/teams/${teamId}/members/${memberId}`,
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to remove member" };
  }
};
