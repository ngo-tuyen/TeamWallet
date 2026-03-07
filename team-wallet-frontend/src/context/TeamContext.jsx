import { createContext, useState } from 'react';

// TeamContextを作成
export const TeamContext = createContext();

// TeamContextプロバイダー
export const TeamProvider = ({ children }) => {
  // 現在選択されているチーム
  const [currentTeam, setCurrentTeam] = useState(null);
  // チーム一覧
  const [teams, setTeams] = useState([]);
  // 月間サマリー
  const [summary, setSummary] = useState(null);
  // ローディング状態
  const [loading, setLoading] = useState(false);

  // チームを選択
  const selectTeam = (team) => {
    setCurrentTeam(team);
  };

  // チーム一覧を更新
  const updateTeams = (teamList) => {
    setTeams(teamList);
  };

  // サマリーを更新
  const updateSummary = (summaryData) => {
    setSummary(summaryData);
  };

  const value = {
    currentTeam,
    teams,
    summary,
    loading,
    selectTeam,
    updateTeams,
    updateSummary,
    setLoading,
  };

  return (
    <TeamContext.Provider value={value}>
      {children}
    </TeamContext.Provider>
  );
};