import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import { getMembers, updateMemberRole, removeMember } from '../services/memberService.js';
import { getTeamDetail } from '../services/teamService.js';
import { searchUsers, sendInvitation } from '../services/invitationService.js';
import { useAuth } from '../hooks/useAuth.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

export default function MemberPage() {
  const { teamId } = useParams();
  const { user } = useAuth();
  const [team, setTeam] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [inviteRole, setInviteRole] = useState('user');
  const [inviting, setInviting] = useState(false);

  // メンバー一覧を取得
  useEffect(() => {
    const fetchData = async () => {
      try {
        const teamData = await getTeamDetail(teamId);
        setTeam(teamData);
        setMembers(teamData.members || []);
      } catch (err) {
        setError('Failed to load members');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [teamId]);

  // ユーザーを検索
  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      const results = await searchUsers(query);
      // 既に参加しているメンバーを除外
      const memberIds = members.map(m => m.user_id);
      const filtered = results.filter(user => !memberIds.includes(user.user_id));
      setSearchResults(filtered);
    } catch (err) {
      setError('Failed to search users');
    } finally {
      setSearching(false);
    }
  };

  // 招待を送信
  const handleSendInvitation = async () => {
    if (!selectedUser) return;

    setInviting(true);
    try {
      await sendInvitation(teamId, selectedUser.user_id, inviteRole);
      setError('');
      setSearchQuery('');
      setSearchResults([]);
      setSelectedUser(null);
      setInviteRole('user');
      setShowInviteForm(false);
      alert('Invitation sent successfully!');
    } catch (err) {
      setError(err.message || 'Failed to send invitation');
    } finally {
      setInviting(false);
    }
  };

  // ロールを変更
  const handleUpdateRole = async (memberId, newRole) => {
    try {
      await updateMemberRole(teamId, memberId, newRole);
      const data = await getMembers(teamId);
      setMembers(data);
    } catch (err) {
      setError('Failed to update member role');
    }
  };

  // メンバーを削除
  const handleRemoveMember = async (memberId) => {
    if (window.confirm('Are you sure you want to remove this member?')) {
      try {
        await removeMember(teamId, memberId);
        const data = await getMembers(teamId);
        setMembers(data);
      } catch (err) {
        setError('Failed to remove member');
      }
    }
  };

  return (
    <Layout>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Team Members</h1>
          <button
            onClick={() => setShowInviteForm(!showInviteForm)}
            hidden={members.find(m => m.user_id === user?.user_id)?.role === 'user'}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
            title={members.find(m => m.user_id === user?.user_id)?.role !== 'admin' ? 'Only admin can invite members' : ''}
          >
            {showInviteForm ? 'Cancel' : 'Invite Member'}
          </button>
        </div>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

        {/* 招待フォーム */}
        {showInviteForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Invite Member</h2>
            
            {/* ユーザー検索 */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Search User by Username</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Enter username..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {searching && <span className="text-gray-500">Searching...</span>}
              </div>

              {/* 検索結果 */}
              {searchResults.length > 0 && (
                <div className="mt-3 border border-gray-300 rounded-lg max-h-48 overflow-y-auto">
                  {searchResults.map((user) => (
                    <button
                      key={user.user_id}
                      onClick={() => {
                        setSelectedUser(user);
                        setSearchQuery('');
                        setSearchResults([]);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-blue-50 border-b last:border-b-0"
                    >
                      <p className="font-semibold text-gray-800">{user.username}</p>
                      <p className="text-sm text-gray-600">{user.full_name}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 選択されたユーザー表示 */}
            {selectedUser && (
              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <p className="font-semibold text-gray-800">Selected: {selectedUser.username}</p>
                <p className="text-gray-600">{selectedUser.full_name}</p>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="text-red-500 text-sm mt-2 hover:text-red-700"
                >
                  Clear Selection
                </button>
              </div>
            )}

            {/* ロール選択 */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Role</label>
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="user">User (View only)</option>
                <option value="manager">Manager (Add/Edit transactions)</option>
              </select>
              <p className="text-gray-500 text-sm mt-2">
                {inviteRole === 'user' && 'Can view team data only'}
                {inviteRole === 'manager' && 'Can add and edit income/expenses'}
              </p>
            </div>

            {/* 送信ボタン */}
            <button
              onClick={handleSendInvitation}
              disabled={!selectedUser || inviting}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition disabled:opacity-50"
            >
              {inviting ? 'Sending Invitation...' : 'Send Invitation'}
            </button>
          </div>
        )}

        {/* メンバーリスト */}
        {loading ? (
          <LoadingSpinner message="Loading members..." />
        ) : members.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600 mb-4">No members in this team</p>
            <button
              onClick={() => setShowInviteForm(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg"
            >
              Invite First Member
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold">Username</th>
                  <th className="px-6 py-3 text-left font-semibold">Full Name</th>
                  <th className="px-6 py-3 text-left font-semibold">Role</th>
                  <th className="px-6 py-3 text-left font-semibold">Joined</th>
                  <th className="px-6 py-3 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {members.map((member) => (
                  <tr key={member.member_id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 text-gray-800 font-semibold">{member.username}</td>
                    <td className="px-6 py-3 text-gray-600">{member.full_name}</td>
                    <td className="px-6 py-3">
                      <select
                        value={member.role}
                        onChange={(e) => handleUpdateRole(member.member_id, e.target.value)}
                        disabled={team?.admin_id === member.user_id || members.find(m => m.user_id === user?.user_id)?.role !== 'admin'}
                        className="px-2 py-1 border border-gray-300 rounded text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                        title={
                          team?.admin_id === member.user_id 
                            ? 'Team creator cannot change their own role' 
                            : members.find(m => m.user_id === user?.user_id)?.role !== 'admin'
                            ? 'Only admin can change roles'
                            : ''
                        }
                      >
                        <option value="user">User</option>
                        <option value="manager">Manager</option>
                        <option value="admin">Admin</option>
                      </select>
                      {team?.admin_id === member.user_id && (
                        <p className="text-xs text-gray-500 mt-1">Team Creator</p>
                      )}
                    </td>
                    <td className="px-6 py-3 text-gray-600 text-sm">{new Date(member.joined_at).toLocaleDateString()}</td>
                    <td className="px-6 py-3">
                      <button
                        onClick={() => handleRemoveMember(member.member_id)}
                        disabled={members.find(m => m.user_id === user?.user_id)?.role !== 'admin'}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
                        title={members.find(m => m.user_id === user?.user_id)?.role !== 'admin' ? 'Only admin can remove members' : ''}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}