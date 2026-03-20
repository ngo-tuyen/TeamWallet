import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import { useTeam } from '../hooks/useTeam.js';
import { getTeams } from '../services/teamService.js';

export default function DashboardPage() {
  const { teams, updateTeams, setLoading, loading } = useTeam();
  const [error, setError] = useState('');

  // チーム一覧を取得
  useEffect(() => {
    const fetchTeams = async () => {
      setLoading(true);
      try {
        const data = await getTeams();
        updateTeams(data);
      } catch (err) {
        setError(err.message || 'Failed to load teams');
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  return (
    <Layout>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">My Teams</h1>
          <Link
            to="/teams/create"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
          >
            Create Team
          </Link>
        </div>

        {/* エラー表示 */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* ローディング表示 */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading teams...</p>
          </div>
        ) : teams.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">No Teams Yet</h2>
            <p className="text-gray-600 mb-6">Create your first team to get started</p>
            <Link
              to="/teams/create"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg inline-block"
            >
              Create Your First Team
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map((team) => (
              <Link
                key={team.team_id}
                to={`/teams/${team.team_id}`}
                className="bg-white rounded-lg shadow hover:shadow-lg transition p-6"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {team.team_name}
                </h3>
                {team.description && (
                  <p className="text-gray-600 mb-4">{team.description}</p>
                )}
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>{team.member_count} members</span>
                  <span>Created {new Date(team.created_at).toLocaleDateString()}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}