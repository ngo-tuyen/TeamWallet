import { useAuth } from '../hooks/useAuth.js';
import { logoutUser } from '../services/authService.js';
import { useNavigate, Link } from 'react-router-dom';
import { useTeam } from '../hooks/useTeam.js';
import { useState, useEffect } from 'react';
import { getMyInvitations } from '../services/invitationService.js';

export default function Header() {
  const { user, logout } = useAuth();
  const { currentTeam } = useTeam();
  const navigate = useNavigate();
  const [invitationCount, setInvitationCount] = useState(0);

  // 招待数を取得
  useEffect(() => {
    const fetchInvitations = async () => {
      try {
        const invitations = await getMyInvitations();
        setInvitationCount(invitations.length);
      } catch (err) {
        // Silently fail
      }
    };

    // 初回取得
    fetchInvitations();

    // 30秒ごとに更新
    const interval = setInterval(fetchInvitations, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logoutUser();
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/dashboard" className="text-2xl font-bold text-blue-600">
          Team Wallet
        </Link>
        <div className="flex-1 text-center">
          {currentTeam && <p className="text-gray-600"><span className="font-semibold">{currentTeam.team_name}</span></p>}
        </div>
        <div className="flex items-center space-x-6">
          <div className="relative">
            <Link to="/invitations" className="text-blue-500 hover:text-blue-600 font-semibold relative">
              Invitations
              {invitationCount > 0 && (
                <span className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  {invitationCount}
                </span>
              )}
            </Link>
          </div>
          <div className="text-right">
            <p className="text-gray-700 font-semibold">{user?.full_name}</p>
            <p className="text-gray-500 text-sm">{user?.username}</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}