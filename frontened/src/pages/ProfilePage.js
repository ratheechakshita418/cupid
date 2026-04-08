import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    bio: user?.bio || '',
    age: user?.age || '',
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await axios.put('/api/users/profile', form);
      updateUser(data);
      setEditing(false);
    } catch (err) {
      console.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '40px 24px' }}>
      <h1 style={{ marginBottom: 28 }}>👤 My Profile</h1>

      <div style={{ background: 'white', borderRadius: 12, padding: 24, border: '1px solid #e5e7eb' }}>
        {!editing ? (
          <>
            <div style={{ marginBottom: 20 }}>
              <h2>{user.firstName} {user.lastName}</h2>
              <p style={{ color: '#6b7280' }}>{user.age} years old • {user.university}</p>
              <p style={{ marginTop: 12, color: '#6b7280' }}>{user.bio}</p>
            </div>

            {user.personality?.mbti && (
              <div style={{ background: '#f9fafb', padding: 16, borderRadius: 8, marginBottom: 20 }}>
                <h3>MBTI: {user.personality.mbti}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12, fontSize: 12 }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>Openness</div>
                    <div>{Math.round(user.personality.traits?.openness || 0)}/100</div>
                  </div>
                  <div>
                    <div style={{ fontWeight: 600 }}>Conscientiousness</div>
                    <div>{Math.round(user.personality.traits?.conscientiousness || 0)}/100</div>
                  </div>
                  <div>
                    <div style={{ fontWeight: 600 }}>Extraversion</div>
                    <div>{Math.round(user.personality.traits?.extraversion || 0)}/100</div>
                  </div>
                  <div>
                    <div style={{ fontWeight: 600 }}>Agreeableness</div>
                    <div>{Math.round(user.personality.traits?.agreeableness || 0)}/100</div>
                  </div>
                </div>
              </div>
            )}

            <button className="btn-primary" onClick={() => setEditing(true)} style={{ width: '100%' }}>
              ✏️ Edit Profile
            </button>
          </>
        ) : (
          <>
            <div className="form-group">
              <label className="label">First Name</label>
              <input className="input-field" name="firstName" value={form.firstName} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="label">Last Name</label>
              <input className="input-field" name="lastName" value={form.lastName} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="label">Age</label>
              <input className="input-field" name="age" type="number" value={form.age} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="label">Bio</label>
              <textarea className="input-field" name="bio" value={form.bio} onChange={handleChange} rows={4} />
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn-secondary" onClick={() => setEditing(false)} style={{ flex: 1 }}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleSave} disabled={saving} style={{ flex: 1 }}>
                {saving ? '⏳ Saving...' : '💾 Save'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
