import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './AuthPage.module.css';

const UNIVERSITIES = [
  'IIT Delhi', 'IIT Bombay', 'IIT Madras', 'IIT Kanpur', 'IIT Kharagpur',
  'BITS Pilani', 'NIT Trichy', 'NIT Warangal', 'DTU Delhi', 'VIT Vellore',
  'IIIT Hyderabad', 'Manipal University', 'Amity University', 'Christ University',
  'Delhi University', 'Mumbai University', 'Pune University', 'Anna University',
  'Jadavpur University', 'Other',
];

const COURSES = [
  'Computer Science & Engineering', 'Information Technology', 'Electronics & Communication',
  'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering',
  'Data Science & AI', 'Business Administration (MBA)', 'Economics',
  'Psychology', 'Design', 'Architecture', 'Biotechnology', 'Mathematics',
  'Physics', 'Chemistry', 'Medicine (MBBS)', 'Law (LLB)', 'Mass Communication', 'Other',
];

export default function SignupPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    university: '', course: '', year: '', age: '', bio: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const validateStep1 = () => {
    if (!form.name.trim()) return 'Please enter your name.';
    if (!form.email.includes('@')) return 'Please enter a valid email.';
    if (form.password.length < 6) return 'Password must be at least 6 characters.';
    if (form.password !== form.confirmPassword) return 'Passwords do not match.';
    return null;
  };

  const validateStep2 = () => {
    if (!form.university) return 'Please select your university.';
    if (!form.course) return 'Please select your course.';
    if (!form.year) return 'Please select your year.';
    return null;
  };

  const nextStep = () => {
    setError('');
    const err = step === 1 ? validateStep1() : validateStep2();
    if (err) { setError(err); return; }
    setStep(step + 1);
  };

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      await signup(form);
      navigate('/questionnaire');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
      setLoading(false);
    }
  };

  const progress = (step / 3) * 100;

  return (
    <div className={styles.pageWrap}>
      <div className="bg-orbs">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>
      <div className={styles.card} style={{ maxWidth: 480 }}>
        <div className={styles.logoMark}>💘</div>
        <h1 className={styles.title}>Join Cupid</h1>
        <p className={styles.subtitle}>Step {step} of 3 — {step === 1 ? 'Account Details' : step === 2 ? 'University Info' : 'Almost there!'}</p>

        {/* Progress bar */}
        <div style={{ height: 5, background: '#f3f4f6', borderRadius: 3, marginBottom: 28, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(135deg,#e91e8c,#7c3aed)', borderRadius: 3, transition: 'width 0.4s ease' }} />
        </div>

        {error && <div className={styles.errorBox}>{error}</div>}

        {/* Step 1: Account */}
        {step === 1 && (
          <>
            <div className="form-group">
              <label className="label">Full Name</label>
              <input className="input-field" placeholder="Arjun Kumar" value={form.name} onChange={set('name')} />
            </div>
            <div className="form-group">
              <label className="label">Email Address</label>
              <input className="input-field" type="email" placeholder="arjun@iitd.ac.in" value={form.email} onChange={set('email')} />
            </div>
            <div className="form-group">
              <label className="label">Password</label>
              <input className="input-field" type="password" placeholder="At least 6 characters" value={form.password} onChange={set('password')} />
            </div>
            <div className="form-group">
              <label className="label">Confirm Password</label>
              <input className="input-field" type="password" placeholder="Repeat your password" value={form.confirmPassword} onChange={set('confirmPassword')} />
            </div>
            <button className="btn-primary" style={{ width: '100%' }} onClick={nextStep}>
              Next →
            </button>
          </>
        )}

        {/* Step 2: University */}
        {step === 2 && (
          <>
            <div className="form-group">
              <label className="label">University</label>
              <select className="select-field" value={form.university} onChange={set('university')}>
                <option value="">Select your university...</option>
                {UNIVERSITIES.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="label">Course / Programme</label>
              <select className="select-field" value={form.course} onChange={set('course')}>
                <option value="">Select your course...</option>
                {COURSES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className="form-group">
                <label className="label">Year</label>
                <select className="select-field" value={form.year} onChange={set('year')}>
                  <option value="">Year</option>
                  {[1, 2, 3, 4, 5, 6].map((y) => <option key={y} value={y}>Year {y}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="label">Age</label>
                <input className="input-field" type="number" placeholder="20" min="17" max="35" value={form.age} onChange={set('age')} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setStep(1)}>← Back</button>
              <button className="btn-primary" style={{ flex: 2 }} onClick={nextStep}>Next →</button>
            </div>
          </>
        )}

        {/* Step 3: Bio + Submit */}
        {step === 3 && (
          <>
            <div style={{ textAlign: 'center', fontSize: 56, marginBottom: 16 }}>🎉</div>
            <p style={{ textAlign: 'center', color: '#6b7280', fontSize: 14, marginBottom: 20, lineHeight: 1.6 }}>
              Almost done! Add a short bio — this appears on your profile and helps with first impressions.
            </p>
            <div className="form-group">
              <label className="label">Bio (optional)</label>
              <textarea
                className="input-field"
                placeholder="Tell potential matches a little about yourself — your passions, quirks, or what you're looking for..."
                value={form.bio}
                onChange={set('bio')}
                rows={4}
                style={{ resize: 'none' }}
              />
              <div style={{ textAlign: 'right', fontSize: 12, color: '#9ca3af', marginTop: 4 }}>{form.bio.length}/300</div>
            </div>
            <button className="btn-primary" style={{ width: '100%' }} onClick={handleSubmit} disabled={loading}>
              {loading ? '⏳ Creating your account...' : '💘 Create Account & Continue'}
            </button>
            <button className="btn-ghost" style={{ width: '100%', marginTop: 8 }} onClick={handleSubmit}>
              Skip for now
            </button>
            <button className="btn-secondary" style={{ width: '100%', marginTop: 8 }} onClick={() => setStep(2)}>
              ← Back
            </button>
          </>
        )}

        <div className={styles.divider}><span>or</span></div>
        <p className={styles.switchText}>
          Already have an account? <Link to="/login">Sign in →</Link>
        </p>
      </div>
    </div>
  );
}
