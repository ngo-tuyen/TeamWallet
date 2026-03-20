import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { getSystemStats, getAllTeams, deleteTeamAsAdmin } from '../services/adminService.js';

export default function AdminPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(null);

  const isSuperAdmin = user?.username === 'SUPER_admIn';

  useEffect(() => {
    if (!isSuperAdmin) {
      navigate('/dashboard');
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const statsData = await getSystemStats();
        const teamsData = await getAllTeams();
        setStats(statsData);
        setTeams(teamsData);
      } catch (err) {
        setError(err.message || 'Failed to load admin data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isSuperAdmin, navigate]);

  const handleDeleteTeam = async (teamId, teamName) => {
    if (!window.confirm(`Delete team "${teamName}"? This cannot be undone.`)) return;

    setDeleting(teamId);
    try {
      await deleteTeamAsAdmin(teamId);
      const teamsData = await getAllTeams();
      setTeams(teamsData);
    } catch (err) {
      setError('Failed to delete team');
    } finally {
      setDeleting(null);
    }
  };

  if (!isSuperAdmin) return null;

  return (
    <Layout>
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

        {loading ? (
          <LoadingSpinner message="Loading admin data..." />
        ) : (
          <>
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-blue-50 rounded-lg shadow p-6">
                  <p className="text-gray-600 mb-2">Total Teams</p>
                  <p className="text-4xl font-bold text-blue-600">{stats.total_teams}</p>
                </div>
                <div className="bg-green-50 rounded-lg shadow p-6">
                  <p className="text-gray-600 mb-2">Total Users</p>
                  <p className="text-4xl font-bold text-green-600">{stats.total_users}</p>
                </div>
                <div className="bg-purple-50 rounded-lg shadow p-6">
                  <p className="text-gray-600 mb-2">Active Teams (30 days)</p>
                  <p className="text-4xl font-bold text-purple-600">{stats.active_teams}</p>
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b">
                <h2 className="text-xl font-bold text-gray-800">All Teams</h2>
              </div>

              {teams.length === 0 ? (
                <div className="p-12 text-center text-gray-600">No teams found</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-6 py-3 text-left font-semibold">Team Name</th>
                        <th className="px-6 py-3 text-left font-semibold">Admin</th>
                        <th className="px-6 py-3 text-left font-semibold">Members</th>
                        <th className="px-6 py-3 text-left font-semibold">Created</th>
                        <th className="px-6 py-3 text-left font-semibold">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {teams.map((team) => (
                        <tr key={team.team_id}>
                          <td className="px-6 py-3 font-semibold">{team.team_name}</td>
                          <td className="px-6 py-3">{team.admin_name}</td>
                          <td className="px-6 py-3">{team.member_count}</td>
                          <td className="px-6 py-3 text-sm">{new Date(team.created_at).toLocaleDateString()}</td>
                          <td className="px-6 py-3">
                            <button
                              onClick={() => handleDeleteTeam(team.team_id, team.team_name)}
                              disabled={deleting === team.team_id}
                              className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded text-sm disabled:opacity-50"
                            >
                              {deleting === team.team_id ? 'Deleting...' : 'Delete'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}