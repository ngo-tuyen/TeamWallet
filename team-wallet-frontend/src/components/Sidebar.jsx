import { Link } from 'react-router-dom';
import { useTeam } from '../hooks/useTeam.js';
import { useAuth } from '../hooks/useAuth.js';

export default function Sidebar() {
  const { currentTeam } = useTeam();
  const { user } = useAuth();
  const isSuperAdmin = user?.username === 'SUPER_admIn';

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Invitations', path: '/invitations' },
    { label: 'Teams', path: '/teams' },
    ...(isSuperAdmin ? [{ label: 'Admin', path: '/admin', admin: true }] : []),
    ...(currentTeam ? [
      { label: 'Members', path: `/teams/${currentTeam.team_id}/members` },
      { label: 'Categories', path: `/teams/${currentTeam.team_id}/categories` },
      { label: 'Income', path: `/teams/${currentTeam.team_id}/income` },
      { label: 'Expenses', path: `/teams/${currentTeam.team_id}/expenses` },
      { label: 'Summary', path: `/teams/${currentTeam.team_id}/summary` },
    ] : []),
  ];

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen p-4">
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`block px-4 py-2 rounded-lg transition ${item.admin ? 'hover:bg-red-700 border-l-4 border-red-500' : 'hover:bg-gray-700'}`}
          >
            <span className="mr-2"></span>{item.label}
          </Link>
        ))}
      </nav>
      {isSuperAdmin && (
        <div className="mt-8 pt-4 border-t border-gray-700 bg-red-900 bg-opacity-50 rounded p-3 text-center">
          <p className="text-xs font-semibold text-red-300">SUPER ADMIN</p>
        </div>
      )}
    </aside>
  );
}