import { Link } from 'react-router-dom';
import './Footer.css';

/**
 * Application footer component
 */
export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__brand">
          <Link to="/" className="footer__logo">
            <svg className="footer__logo-icon" viewBox="0 0 40 40" fill="none" aria-hidden="true">
              <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2" />
              <path d="M20 10v20M10 20h20" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
            <span className="footer__logo-text">DoctorGo</span>
          </Link>
          <p className="footer__tagline">
            Find and book healthcare providers with ease.
          </p>
        </div>

        <nav className="footer__nav" aria-label="Footer navigation">
          <div className="footer__nav-section">
            <h4 className="footer__nav-title">Services</h4>
            <ul className="footer__nav-list">
              <li><Link to="/">Find Providers</Link></li>
              <li><Link to="/symptom-helper">Symptom Helper</Link></li>
              <li><Link to="/my-appointments">Appointments</Link></li>
            </ul>
          </div>

          <div className="footer__nav-section">
            <h4 className="footer__nav-title">Account</h4>
            <ul className="footer__nav-list">
              <li><Link to="/signin">Sign In</Link></li>
              <li><Link to="/signup">Create Account</Link></li>
              <li><Link to="/profile">My Profile</Link></li>
            </ul>
          </div>

          <div className="footer__nav-section">
            <h4 className="footer__nav-title">For Providers</h4>
            <ul className="footer__nav-list">
              <li><Link to="/provider-panel">Management Panel</Link></li>
              <li><Link to="/">Join Network</Link></li>
            </ul>
          </div>
        </nav>

        <div className="footer__bottom">
          <p className="footer__copyright">
            &copy; {new Date().getFullYear()} DoctorGo. All rights reserved.
          </p>
          <p className="footer__disclaimer">
            This is a demonstration application for educational purposes.
          </p>
        </div>
      </div>
    </footer>
  );
}
