import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function MatchesPage() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const { data } = await axios.get('/api/users/matches');
        setMatches(data.filter((m) => m.status === 'match'));
      } catch (err) {
        console.error('Failed to load matches');
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px' }}>
      <h1 style={{ marginBottom: 28 }}>💘 Your Matches</h1>
      {matches.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#6b7280' }}>
          No matches yet. Keep exploring!
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 20 }}>
          {matches.map((match) => (
            <div
              key={match.userId?._id}
              onClick={() => navigate(`/chat/${match.userId?._id}`)}
              style={{
                background: 'linear-gradient(135deg, #e91e8c, #7c3aed)',
                borderRadius: 16,
                padding: 20,
                color: 'white',
                cursor: 'pointer',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            >
              <h3>{match.userId?.firstName}</h3>
              <p>{match.userId?.university}</p>
              <p style={{ fontSize: 12, opacity: 0.8 }}>Click to chat</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
