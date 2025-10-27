import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateTeam = () => {
  const [teamName, setTeamName] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const res = await axios.post(
        'http://localhost:5000/api/teams',
        { name: teamName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const team = res.data.team;
      localStorage.setItem('selectedTeam', JSON.stringify(team));
      setMessage(`✅ Team "${team.name}" created successfully!`);

      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (err) {
      console.error('❌ Create team error:', err.response?.data || err.message);
      setMessage('❌ Failed to create team.');
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '400px' }}>
      <h2>Create a New Team</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Team name"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          required
        />
        <button type="submit" className="btn btn-primary w-100">Create Team</button>
      </form>
      {message && <div className="mt-3 alert alert-info">{message}</div>}
    </div>
  );
};

export default CreateTeam;
