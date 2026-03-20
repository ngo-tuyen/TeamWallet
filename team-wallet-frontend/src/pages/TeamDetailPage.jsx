import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import { useTeam } from '../hooks/useTeam.js';
import { getTeamDetail, deleteTeam, getTeamSummary } from '../services/teamService.js';

export default function TeamDetailPage() {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const { selectTeam, updateSummary } = useTeam();

  const [team, setTeam] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));

  // チーム詳細とサマリーを取得
  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const teamData = await getTeamDetail(teamId);
        setTeam(teamData);
        selectTeam(teamData);

        const summaryData = await getTeamSummary(teamId, month);
        setSummary(summaryData);
        updateSummary(summaryData);
      } catch (err) {
        setError('Failed to load team data');
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, [teamId, month]);

  // チーム削除処理
  const handleDeleteTeam = async () => {
    if (window.confirm('Are you sure you want to delete this team? This action cannot be undone.')) {
      try {
        await deleteTeam(teamId);
        navigate('/dashboard');
      } catch (err) {
        setError('Failed to delete team');
      }
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading team...</p>
        </div>
      </Layout>
    );
  }

  if (error || !team) {
    return (
      <Layout>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error || 'Team not found'}
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div>
        {/* ヘッダー */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{team.team_name}</h1>
            {team.description && (
              <p className="text-gray-600 mt-2">{team.description}</p>
            )}
          </div>
          <div className="flex space-x-2">
            <Link
              to={`/teams/${teamId}/edit`}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
            >
              Edit
            </Link>
            <button
              onClick={handleDeleteTeam}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg"
            >
              Delete
            </button>
          </div>
        </div>

        {/* メンバー情報 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-600">Members</p>
              <p className="text-3xl font-bold text-gray-800">{team.members?.length || 0}</p>
            </div>
            <Link
              to={`/teams/${teamId}/members`}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
            >
              Manage Members
            </Link>
          </div>
        </div>

        {/* サマリー */}
        {summary && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">
                Select Month
              </label>
              <input
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 総収入 */}
              <div className="bg-green-50 p-6 rounded-lg">
                <p className="text-gray-600 mb-2">Total Income</p>
                <p className="text-3xl font-bold text-green-600">
                  ¥{summary.total_income?.toLocaleString() || 0}
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  {summary.income_count} records
                </p>
              </div>

              {/* 総支出 */}
              <div className="bg-red-50 p-6 rounded-lg">
                <p className="text-gray-600 mb-2">Total Expenses</p>
                <p className="text-3xl font-bold text-red-600">
                  ¥{summary.total_expense?.toLocaleString() || 0}
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  {summary.expense_count} records
                </p>
              </div>

              {/* 残高 */}
              <div className={`p-6 rounded-lg ${summary.balance >= 0 ? 'bg-blue-50' : 'bg-orange-50'}`}>
                <p className="text-gray-600 mb-2">Balance</p>
                <p className={`text-3xl font-bold ${summary.balance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                  ¥{summary.balance?.toLocaleString() || 0}
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  Income - Expenses
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}