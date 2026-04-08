import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './LandingPage.module.css';

const FEATURES = [
  { emoji: '🧠', title: 'AI Personality Matching', desc: 'Our engine analyses 12 dimensions of personality to find truly compatible connections.', bg: '#fdf2f8' },
  { emoji: '💘', title: 'Smart Card Discovery', desc: 'Swipe through curated match cards ranked by deep compatibility, not just appearances.', bg: '#f5f3ff' },
  { emoji: '💬', title: 'Real-time Chat', desc: 'Message matches instantly with AI icebreaker suggestions to spark great conversations.', bg: '#fff1f2' },
  { emoji: '🛡️', title: 'Safe & Trusted', desc: 'University-verified profiles with trust scores and toxic message detection.', bg: '#ecfdf5' },
  { emoji: '🎵', title: 'Music & Vibe Matching', desc: 'We factor in your music taste, hobbies and lifestyle for deeper compatibility.', bg: '#fffbeb' },
  { emoji: '📊', title: 'Explainable AI', desc: 'See exactly why you match — breakdown by interests, personality, goals and values.', bg: '#f0f9ff' },
];

const STATS = [
  { num: '24K+', label: 'Students' },
  { num: '89%', label: 'Match Rate' },
  { num: '50+', label: 'Universities' },
  { num: '4.9★', label: 'Rating' },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const heartsRef = useRef(null);

  useEffect(() => {
    const hearts = ['💕', '💘', '💗', '💖', '✨', '🌸', '⭐', '💫', '🌺', '🎀'];
    const container = heartsRef.current;
    if (!container) return;
    hearts.forEach((h, i) => {
      const el = document.createElement('div');
      el.className = styles.heartParticle;
      el.textContent = h;
      el.style.left = Math.random() * 90 + 5 + '%';
      el.style.top = Math.random() * 80 + 5 + '%';
      el.style.animationDelay = i * 0.7 + 's';
      el.style.animationDuration = 5 + Math.random() * 4 + 's';
      el.style.fontSize = 14 + Math.random() * 14 + 'px';
      container.appendChild(el);
    });
  }, []);

  const handleCTA = () => navigate(user ? (user.questionnaireCompleted ? '/explore' : '/questionnaire') : '/signup');

  return (
    <div className={styles.wrap}>
      <div className="bg-orbs">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heartsFloat} ref={heartsRef} />
        <div className={styles.badge}>✨ AI-Powered University Connections</div>
        <h1 className={styles.heroTitle}>
          Find Your <span className="gradient-text">Perfect Match</span>
          <br />at University
        </h1>
        <p className={styles.heroSub}>
          Cupid uses AI and personality science to connect you with students who truly align
          with your mind, heart, and ambitions — across 50+ universities.
        </p>
        <div className={styles.heroActions}>
          <button className="btn-primary" style={{ fontSize: 16, padding: '14px 36px' }} onClick={handleCTA}>
            💘 Find My Match
          </button>
          {!user && (
            <button className="btn-secondary" style={{ fontSize: 16, padding: '14px 36px' }} onClick={() => navigate('/login')}>
              Sign In
            </button>
          )}
        </div>
        <div className={styles.statsRow}>
          {STATS.map((s) => (
            <div key={s.label} className={styles.statItem}>
              <div className={styles.statNum}>{s.num}</div>
              <div className={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className={styles.features}>
        <h2 className={styles.sectionTitle}>
          Why students love <span className="gradient-text">Cupid</span>
        </h2>
        <div className={styles.featuresGrid}>
          {FEATURES.map((f) => (
            <div key={f.title} className={styles.featureCard} style={{ '--card-bg': f.bg }}>
              <div className={styles.featureIcon}>{f.emoji}</div>
              <h3 className={styles.featureTitle}>{f.title}</h3>
              <p className={styles.featureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className={styles.ctaBanner}>
        <div className={styles.ctaInner}>
          <h2>Ready to meet your match?</h2>
          <p>Join 24,000+ students already on Cupid. It takes 3 minutes.</p>
          <button className="btn-primary" style={{ fontSize: 16, padding: '14px 40px', background: 'white', color: '#e91e8c', WebkitTextFillColor: '#e91e8c', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }} onClick={handleCTA}>
            💘 Get Started — It's Free
          </button>
        </div>
      </section>
    </div>
  );
}
