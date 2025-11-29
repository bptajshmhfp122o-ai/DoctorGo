import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

/**
 * Main application header with navigation
 */
export function Header() {
  const { user, isAuthenticated, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Find Providers' },
    { path: '/symptom-helper', label: 'Symptom Helper' },
    { path: '/my-appointments', label: 'My Appointments' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="header">
      <div className="header__container">
        <Link to="/" className="header__logo" aria-label="DoctorGo Home">
          <svg className="header__logo-icon" viewBox="0 0 40 40" fill="none" aria-hidden="true">
            <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2" />
            <path d="M20 10v20M10 20h20" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <span className="header__logo-text">DoctorGo</span>
        </Link>

        <nav className="header__nav" aria-label="Main navigation">
          <ul className="header__nav-list">
            {navLinks.map(link => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`header__nav-link ${isActive(link.path) ? 'header__nav-link--active' : ''}`}
                  aria-current={isActive(link.path) ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header__actions">
          {isAuthenticated ? (
            <div className="header__user-menu">
              <Link to="/profile" className="header__user-link">
                <span className="header__user-avatar">
                  {user.firstName?.charAt(0) || 'U'}
                </span>
                <span className="header__user-name">{user.firstName}</span>
              </Link>
              <button onClick={signOut} className="header__signout">
                Sign Out
              </button>
            </div>
          ) : (
            <div className="header__auth-links">
              <Link to="/signin" className="header__signin">Sign In</Link>
              <Link to="/signup" className="header__signup">Sign Up</Link>
            </div>
          )}
        </div>

        <button
          className="header__mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
          aria-label="Toggle navigation menu"
        >
          <span className={`header__hamburger ${mobileMenuOpen ? 'header__hamburger--open' : ''}`}>
            <span />
            <span />
            <span />
          </span>
        </button>
      </div>

      {mobileMenuOpen && (
        <div id="mobile-menu" className="header__mobile-menu">
          <nav aria-label="Mobile navigation">
            <ul className="header__mobile-nav-list">
              {navLinks.map(link => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={`header__mobile-nav-link ${isActive(link.path) ? 'header__mobile-nav-link--active' : ''}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="header__mobile-divider" />
              {isAuthenticated ? (
                <>
                  <li>
                    <Link to="/profile" className="header__mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                      My Profile
                    </Link>
                  </li>
                  <li>
                    <button
                      className="header__mobile-nav-link header__mobile-signout"
                      onClick={() => { signOut(); setMobileMenuOpen(false); }}
                    >
                      Sign Out
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/signin" className="header__mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                      Sign In
                    </Link>
                  </li>
                  <li>
                    <Link to="/signup" className="header__mobile-nav-link header__mobile-signup" onClick={() => setMobileMenuOpen(false)}>
                      Sign Up
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}
