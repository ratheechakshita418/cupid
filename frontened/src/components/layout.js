import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Layout.module.css';

const NAV_ITEMS = [
  { to: '/explore', label: 'Explore', emoji: '✨' },
  { to: '/matches', label: 'Matches', emoji: '💘' },
  { to: '/chat', label: 'Chat', emoji: '💬' },
  { to: '/profile', label: 'Profile', emoji: '👤' },
];

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : '??';

  return (
    <div className={styles.layoutWrap}>
      {/* Background Orbs */}
      <div className="bg-orbs">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      {/* Navbar */}
      <nav className={styles.navbar}>
        <div className={styles.logo} onClick={() => navigate('/explore')}>
          💘 Cupid
        </div>

        <div className={styles.navTabs}>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `${styles.navTab} ${isActive ? styles.navTabActive : ''}`
              }
            >
              <span className={styles.navEmoji}>{item.emoji}</span>
              <span className={styles.navLabel}>{item.label}</span>
            </NavLink>
          ))}
        </div>

        <div className={styles.navRight}>
          <div className={styles.avatar} onClick={() => navigate('/profile')} title={user?.name}>
            {user?.profileImage ? (
              <img src={user.profileImage} alt={user.name} />
            ) : (
              initials
            )}
          </div>
          <button className={styles.logoutBtn} onClick={handleLogout} title="Logout">
            🚪
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className={styles.main}>
        <div className="page-enter">{children}</div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className={styles.mobileNav}>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `${styles.mobileNavItem} ${isActive ? styles.mobileNavActive : ''}`
            }
          >
            <span>{item.emoji}</span>
            <span className={styles.mobileNavLabel}>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
