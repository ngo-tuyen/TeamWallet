import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import { createTeam, updateTeam, getTeamDetail } from '../services/teamService.js';

export default function TeamFormPage() {
  const navigate = useNavigate();
  const { teamId } = useParams();
  
  const [teamName, setTeamName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEdit, setIsEdit] = useState(false);

  // チーム詳細を取得 (編集時)
  useEffect(() => {
    if (teamId) {
      setIsEdit(true);
      const fetchTeam = async () => {
        try {
          const team = await getTeamDetail(teamId);
          setTeamName(team.team_name);
          setDescription(team.description || '');
        } catch (err) {
          setError('Failed to load team');
        }
      };
      fetchTeam();
    }
  }, [teamId]);

  // チーム作成/更新処理
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isEdit) {
        await updateTeam(teamId, teamName, description);
      } else {
        await createTeam(teamName, description);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to save team');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          {isEdit ? 'Edit Team' : 'Create Team'}
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
          {/* チーム名入力フィールド */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Team Name
            </label>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter team name"
            />
          </div>

          {/* 説明入力フィールド */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter team description (optional)"
              rows="4"
            ></textarea>
          </div>

          {/* ボタン */}
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Saving...' : isEdit ? 'Update Team' : 'Create Team'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}