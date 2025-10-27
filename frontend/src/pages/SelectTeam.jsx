import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SelectTeam = () => {
  const [teams, setTeams] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/my-teams', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTeams(res.data.teams);
      } catch (err) {
        console.error('Fetch teams error:', err.response?.data || err.message);
        setMessage('Failed to fetch teams data.');
      }
    };

    fetchTeams();
  }, []);

  const handleSelect = (team) => {
    localStorage.setItem('selectedTeam', JSON.stringify(team));
    setMessage(`Selected team: ${team.name}`);
  };

  return (
    <div className="container mt-5">
      <h2>Selection team</h2>
      {teams.length > 0 ? (
        <ul className="list-group">
          {teams.map((team) => (
            <li
              key={team.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              {team.name}
              <button className="btn btn-primary" onClick={() => handleSelect(team)}>
                Select
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>There are no teams to display.</p>
      )}
      {message && <div className="mt-3 alert alert-info">{message}</div>}
    </div>
  );
};

export default SelectTeam;
