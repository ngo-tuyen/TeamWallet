import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { getMyInvitations, acceptInvitation, rejectInvitation } from '../services/invitationService.js';

export default function InvitationPage() {
  const navigate = useNavigate();
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(null);

  // 招待一覧を取得
  useEffect(() => {
    const fetchInvitations = async () => {
      try {
        const data = await getMyInvitations();
        setInvitations(data);
      } catch (err) {
        setError('Failed to load invitations');
      } finally {
        setLoading(false);
      }
    };

    fetchInvitations();
  }, []);

  // 招待を承認
  const handleAccept = async (invitationId, teamName) => {
    setProcessing(invitationId);
    try {
      await acceptInvitation(invitationId);
      const invitation = invitations.find(inv => inv.invitation_id === invitationId);
      setInvitations(invitations.filter(inv => inv.invitation_id !== invitationId));
      alert(`You have joined "${teamName}" as ${invitation?.role}!`);
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to accept invitation');
    } finally {
      setProcessing(null);
    }
  };

  // 招待を拒否
  const handleReject = async (invitationId) => {
    setProcessing(invitationId);
    try {
      await rejectInvitation(invitationId);
      setInvitations(invitations.filter(inv => inv.invitation_id !== invitationId));
    } catch (err) {
      setError('Failed to reject invitation');
    } finally {
      setProcessing(null);
    }
  };

  const getRoleDescription = (role) => {
    const descriptions = {
      user: 'Can view team data only',
      manager: 'Can add and edit income/expenses',
      admin: 'Can manage team members and all settings',
    };
    return descriptions[role] || role;
  };

  return (
    <Layout>
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Team Invitations</h1>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

        {loading ? (
          <LoadingSpinner message="Loading invitations..." />
        ) : invitations.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600 mb-4">No pending invitations</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg"
            >
              Back to Dashboard
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {invitations.map((invitation) => (
              <div key={invitation.invitation_id} className="bg-white rounded-lg shadow p-6">
                {/* チーム情報 */}
                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-gray-800">{invitation.team_name}</h3>
                  <p className="text-gray-600 text-sm mt-2">
                    Invited by: <span className="font-semibold">{invitation.invited_by_username}</span>
                  </p>
                </div>

                {/* ロール情報 */}
                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                  <p className="text-gray-700 font-semibold mb-1">Your Role:</p>
                  <p className="text-blue-600 font-bold text-lg mb-2">{invitation.role}</p>
                  <p className="text-gray-600 text-sm">{getRoleDescription(invitation.role)}</p>
                </div>

                {/* 招待日時 */}
                <p className="text-gray-500 text-xs mb-6">
                  Invited on: {new Date(invitation.created_at).toLocaleDateString()}
                </p>

                {/* アクションボタン */}
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleAccept(invitation.invitation_id, invitation.team_name)}
                    disabled={processing === invitation.invitation_id}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition disabled:opacity-50"
                  >
                    {processing === invitation.invitation_id ? 'Accepting...' : 'Accept'}
                  </button>
                  <button
                    onClick={() => handleReject(invitation.invitation_id)}
                    disabled={processing === invitation.invitation_id}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition disabled:opacity-50"
                  >
                    {processing === invitation.invitation_id ? 'Rejecting...' : 'Reject'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}