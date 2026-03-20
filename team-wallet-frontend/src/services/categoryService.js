import apiClient from "./api.js";

// カテゴリー一覧を取得
export const getCategories = async (teamId) => {
  try {
    const response = await apiClient.get(`/teams/${teamId}/categories`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch categories" };
  }
};

// カテゴリーを作成
export const createCategory = async (teamId, categoryName) => {
  try {
    const response = await apiClient.post(`/teams/${teamId}/categories`, {
      category_name: categoryName,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to create category" };
  }
};

// カテゴリーを削除
export const deleteCategory = async (teamId, categoryId) => {
  try {
    const response = await apiClient.delete(
      `/teams/${teamId}/categories/${categoryId}`,
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to delete category" };
  }
};
