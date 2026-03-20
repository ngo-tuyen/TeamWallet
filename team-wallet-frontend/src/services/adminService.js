import apiClient from "./api.js";

// システム統計を取得
export const getSystemStats = async () => {
  try {
    const response = await apiClient.get("/admin/stats");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch system stats" };
  }
};

// 全チーム一覧を取得 (管理者用)
export const getAllTeams = async () => {
  try {
    const response = await apiClient.get("/admin/teams");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch all teams" };
  }
};

// チームを削除 (管理者用)
export const deleteTeamAsAdmin = async (teamId) => {
  try {
    const response = await apiClient.delete(`/admin/teams/${teamId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to delete team" };
  }
};
