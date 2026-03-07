import api from "./api.js";

export const getExpenses = async (teamId, month = null, categoryId = null) => {
  const params = {};
  if (month) params.month = month;
  if (categoryId) params.category_id = categoryId;
  const response = await api.get(`/teams/${teamId}/expenses`, { params });
  return response.data;
};

export const createExpense = async (
  teamId,
  categoryId,
  amount,
  expenseDate,
  notes,
) => {
  const response = await api.post(`/teams/${teamId}/expenses`, {
    category_id: categoryId,
    amount,
    expense_date: expenseDate,
    notes,
  });
  return response.data;
};

export const updateExpense = async (
  teamId,
  expenseId,
  categoryId,
  amount,
  expenseDate,
  notes,
) => {
  const response = await api.put(`/teams/${teamId}/expenses/${expenseId}`, {
    category_id: categoryId,
    amount,
    expense_date: expenseDate,
    notes,
  });
  return response.data;
};

export const deleteExpense = async (teamId, expenseId) => {
  const response = await api.delete(`/teams/${teamId}/expenses/${expenseId}`);
  return response.data;
};
