import { useContext } from "react";
import { TeamContext } from "../context/TeamContext.jsx";

// Teamコンテキストを使用するカスタムフック
export const useTeam = () => {
  const context = useContext(TeamContext);

  if (!context) {
    throw new Error("useTeam must be used within TeamProvider");
  }

  return context;
};
