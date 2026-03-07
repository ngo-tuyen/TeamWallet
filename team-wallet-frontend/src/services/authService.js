import api from "./api.js";

export const registerUser = async (username, password, fullName) => {
  const response = await api.post("/auth/register", {
    username,
    password,
    full_name: fullName,
  });
  return response.data;
};

export const loginUser = async (username, password) => {
  const response = await api.post("/auth/login", { username, password });
  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));
  }
  return response.data;
};

export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const isLoggedIn = () => !!localStorage.getItem("token");
