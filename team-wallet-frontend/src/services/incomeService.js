import api from "./api.js";

export const getIncomes = async (teamId, month = null) => {
  const params = month ? { month } : {};
  const response = await api.get(`/teams/${teamId}/incomes`, { params });
  return response.data;
};

export const createIncome = async (teamId, amount, incomeDate, notes) => {
  const response = await api.post(`/teams/${teamId}/incomes`, {
    amount,
    income_date: incomeDate,
    notes,
  });
  return response.data;
};

export const updateIncome = async (
  teamId,
  incomeId,
  amount,
  incomeDate,
  notes,
) => {
  const response = await api.put(`/teams/${teamId}/incomes/${incomeId}`, {
    amount,
    income_date: incomeDate,
    notes,
  });
  return response.data;
};

export const deleteIncome = async (teamId, incomeId) => {
  const response = await api.delete(`/teams/${teamId}/incomes/${incomeId}`);
  return response.data;
};
