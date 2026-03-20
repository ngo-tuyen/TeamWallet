import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";

// 認証コンテキストを使用するカスタムフック
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};
