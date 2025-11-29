import { Header } from './Header';
import { Footer } from './Footer';
import './Layout.css';

/**
 * Main layout wrapper component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Page content
 */
export function Layout({ children }) {
  return (
    <div className="layout">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Header />
      <main id="main-content" className="layout__main">
        {children}
      </main>
      <Footer />
    </div>
  );
}
