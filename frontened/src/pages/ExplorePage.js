import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function ExplorePage() {
  const [matches, setMatches] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const { data } = await axios.get('/api/users/discover');
        setMatches(data);
      } catch (err) {
        setError('Failed to load matches');
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, []);

  const handleLike = async () => {
    try {
      await axios.post(`/api/matches/${matches[currentIdx]._id}/like`);
      nextCard();
    } catch (err) {
      setError('Failed to like user');
    }
  };

  const handleDislike = async () => {
    try {
      await axios.post(`/api/matches/${matches[currentIdx]._id}/dislike`);
      nextCard();
    } catch (err) {
      setError('Failed to dislike user');
    }
  };

  const nextCard = () => {
    if (currentIdx < matches.length - 1) {
      setCurrentIdx(currentIdx + 1);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (matches.length === 0) return <div style={{ textAlign: 'center', padding: 40 }}>No matches available</div>;

  const current = matches[currentIdx];

  return (
    <div style={{ maxWidth: 500, margin: '0 auto', padding: '40px 24px' }}>
      <div style={{ background: 'linear-gradient(135deg, #e91e8c, #7c3aed)', borderRadius: 20, padding: 20, color: 'white', marginBottom: 30 }}>
        <h2>{current.firstName}, {current.age}</h2>
        <p>{current.university} • {current.course}</p>
        {current.bio && <p style={{ marginTop: 12, fontSize: 14 }}>{current.bio}</p>}
      </div>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        <button className="btn-secondary" onClick={handleDislike} style={{ padding: '12px 28px' }}>
          👎 Pass
        </button>
        <button className="btn-primary" onClick={handleLike} style={{ padding: '12px 28px' }}>
          💕 Like
        </button>
      </div>

      <div style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: '#9ca3af' }}>
        {currentIdx + 1} / {matches.length}
      </div>
    </div>
  );
}
