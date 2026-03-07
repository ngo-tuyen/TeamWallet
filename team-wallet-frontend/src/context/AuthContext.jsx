import { createContext, useState, useEffect } from 'react';
import { getCurrentUser, isLoggedIn } from '../services/authService.js';

// AuthContextを作成
export const AuthContext = createContext();

// AuthContextプロバイダー
export const AuthProvider = ({ children }) => {
  // ユーザー状態
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 初期化: localStorageからユーザー情報を読み込み
  useEffect(() => {
    const currentUser = getCurrentUser();
    const loggedIn = isLoggedIn();
    
    if (loggedIn && currentUser) {
      setUser(currentUser);
      setIsAuthenticated(true);
    }
    
    setLoading(false);
  }, []);

  // ログイン状態を更新
  const updateUser = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  // ログアウト
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    updateUser,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};