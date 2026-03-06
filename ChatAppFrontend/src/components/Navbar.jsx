import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isHome = location.pathname === "/home";

  return (
    <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
      <div className="navbar__inner">
        {/* Logo */}
        <div className="navbar__logo" onClick={() => navigate("/home")}>
          <div className="navbar__logo-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" fill="currentColor" opacity="0.3"/>
              <path d="M20 2H4C2.9 2 2 2.9 2 4v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" fill="currentColor"/>
            </svg>
          </div>
          <span className="navbar__logo-text">Convex</span>
        </div>

        {/* Desktop Links */}
        <div className="navbar__links">
          <a href="#features" className="navbar__link">Features</a>
          <a href="#about" className="navbar__link">About</a>
          <a href="#contact" className="navbar__link">Contact</a>
        </div>

        {/* Actions */}
        <div className="navbar__actions">
          <button
            className="navbar__btn navbar__btn--ghost"
            onClick={() => navigate("/login")}
          >
            Sign In
          </button>
          <button
            className="navbar__btn navbar__btn--primary"
            onClick={() => navigate("/register")}
          >
            Get Started
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className={`navbar__hamburger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`navbar__mobile-menu ${menuOpen ? "navbar__mobile-menu--open" : ""}`}>
        <a href="#features" className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>Features</a>
        <a href="#about" className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>About</a>
        <a href="#contact" className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>Contact</a>
        <div className="navbar__mobile-actions">
          <button className="navbar__btn navbar__btn--ghost" onClick={() => { navigate("/login"); setMenuOpen(false); }}>Sign In</button>
          <button className="navbar__btn navbar__btn--primary" onClick={() => { navigate("/register"); setMenuOpen(false); }}>Get Started</button>
        </div>
      </div>
    </nav>
  );
}