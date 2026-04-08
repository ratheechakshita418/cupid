import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function QuestionnairePage() {
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const { data } = await axios.get('/api/personality');
        setQuestions(data);
      } catch (err) {
        setError('Failed to load questions');
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const handleResponse = (questionId, answer) => {
    setResponses({ ...responses, [questionId]: answer });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post('/api/auth/questionnaire', { responses });
      navigate('/explore');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit questionnaire');
      setSubmitting(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: '40px 24px', maxWidth: 600, margin: '0 auto' }}>
      <h1 style={{ marginBottom: 24, textAlign: 'center' }}>Understand Yourself Better</h1>
      <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: 40 }}>
        Answer 12 quick questions to help us find your best matches
      </p>

      {error && <div style={{ background: 'rgba(239,68,68,0.1)', padding: 12, borderRadius: 8, marginBottom: 20, color: '#991b1b' }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        {questions.map((q, idx) => (
          <div key={q.id} style={{ marginBottom: 32 }}>
            <label style={{ display: 'block', marginBottom: 12, fontWeight: 600, color: '#1a0a2e' }}>
              {idx + 1}. {q.question}
            </label>
            <div style={{ display: 'grid', gap: 8 }}>
              {q.answers.map((ans) => (
                <label key={ans} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name={`q${q.id}`}
                    value={ans}
                    checked={responses[q.id] === ans}
                    onChange={() => handleResponse(q.id, ans)}
                    style={{ width: 18, height: 18, cursor: 'pointer' }}
                  />
                  <span>{ans}</span>
                </label>
              ))}
            </div>
          </div>
        ))}

        <button
          className="btn-primary"
          type="submit"
          disabled={submitting || Object.keys(responses).length < questions.length}
          style={{ width: '100%', padding: '14px 20px', marginTop: 20 }}
        >
          {submitting ? '⏳ Submitting...' : '💘 Complete & Continue'}
        </button>
      </form>
    </div>
  );
}
