import apiClient from "./api.js";

// チーム一覧を取得
export const getTeams = async () => {
  try {
    const response = await apiClient.get("/teams");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch teams" };
  }
};

// チーム詳細を取得
export const getTeamDetail = async (teamId) => {
  try {
    const response = await apiClient.get(`/teams/${teamId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch team detail" };
  }
};

// チームを作成
export const createTeam = async (teamName, description) => {
  try {
    const response = await apiClient.post("/teams", {
      team_name: teamName,
      description,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to create team" };
  }
};

// チーム情報を更新
export const updateTeam = async (teamId, teamName, description) => {
  try {
    const response = await apiClient.put(`/teams/${teamId}`, {
      team_name: teamName,
      description,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to update team" };
  }
};

// チームを削除
export const deleteTeam = async (teamId) => {
  try {
    const response = await apiClient.delete(`/teams/${teamId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to delete team" };
  }
};

// チーム月間サマリーを取得
export const getTeamSummary = async (teamId, month) => {
  try {
    const params = month ? { month } : {};
    const response = await apiClient.get(`/teams/${teamId}/summary`, {
      params,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch team summary" };
  }
};
