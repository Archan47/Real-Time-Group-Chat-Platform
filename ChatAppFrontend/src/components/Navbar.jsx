import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [user,      setUser]      = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const checkAuth = () => {
    const token = localStorage.getItem("accessToken");
    if (!token) { setUser(null); return; }
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const email   = payload.sub || payload.email || "";
      const picture = localStorage.getItem("userPicture") || null;
      const name    = localStorage.getItem("userName") || email.split("@")[0];
      setUser({ email, name, picture });
    } catch { setUser(null); }
  };

  // Re-check on every route change
  useEffect(() => { checkAuth(); }, [location.pathname]);

  // Listen for our custom auth event (fired from Login/OAuth2Callback same tab)
  useEffect(() => {
    window.addEventListener("auth:update", checkAuth);
    return () => window.removeEventListener("auth:update", checkAuth);
  }, []);

  // Also catch other-tab storage changes
  useEffect(() => {
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userPicture");
    localStorage.removeItem("userName");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
      <div className="navbar__inner">

        {/* Logo */}
        <div className="navbar__logo" onClick={() => navigate("/")}>
          <div className="navbar__logo-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M20 2H4C2.9 2 2 2.9 2 4v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" fill="currentColor"/>
            </svg>
          </div>
          <span className="navbar__logo-text">Convex</span>
        </div>

        {/* Desktop Links */}
        <div className="navbar__links">
          <a href="#features" className="navbar__link">Features</a>
          <a href="#about"    className="navbar__link">About</a>
          <a href="#contact"  className="navbar__link">Contact</a>
          {user && (
            <button className="navbar__link navbar__link--rooms" onClick={() => navigate("/rooms")}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              Rooms
            </button>
          )}
        </div>

        {/* Actions */}
        <div className="navbar__actions">
          {user ? (
            <div className="navbar__profile">
              <div className="navbar__avatar-wrap">
                {user.picture ? (
                  <img src={user.picture} alt={user.name}
                    className="navbar__avatar-img" referrerPolicy="no-referrer" />
                ) : (
                  <div className="navbar__avatar-fallback">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="navbar__avatar-ring" />
              </div>
              <div className="navbar__dropdown">
                <div className="navbar__dropdown-info">
                  <span className="navbar__dropdown-name">{user.name}</span>
                  <span className="navbar__dropdown-email">{user.email}</span>
                </div>
                <div className="navbar__dropdown-divider" />
                <button className="navbar__dropdown-item" onClick={() => navigate("/profile")}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  Profile
                </button>
                <button className="navbar__dropdown-item" onClick={() => navigate("/rooms")}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                  Rooms
                </button>
                <div className="navbar__dropdown-divider" />
                <button className="navbar__dropdown-item navbar__dropdown-item--danger" onClick={handleLogout}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  Sign out
                </button>
              </div>
            </div>
          ) : (
            <>
              <button className="navbar__btn navbar__btn--ghost"   onClick={() => navigate("/login")}>Sign In</button>
              <button className="navbar__btn navbar__btn--primary" onClick={() => navigate("/register")}>Get Started</button>
            </>
          )}
        </div>

        {/* Hamburger */}
        <button className={`navbar__hamburger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`navbar__mobile-menu ${menuOpen ? "navbar__mobile-menu--open" : ""}`}>
        <a href="#features" className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>Features</a>
        <a href="#about"    className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>About</a>
        {user && (
          <button className="navbar__mobile-link navbar__mobile-link--btn"
            onClick={() => { navigate("/rooms"); setMenuOpen(false); }}>
            Rooms
          </button>
        )}
        <div className="navbar__mobile-actions">
          {user ? (
            <button className="navbar__btn navbar__btn--ghost" onClick={handleLogout}>Sign out</button>
          ) : (
            <>
              <button className="navbar__btn navbar__btn--ghost"   onClick={() => { navigate("/login");    setMenuOpen(false); }}>Sign In</button>
              <button className="navbar__btn navbar__btn--primary" onClick={() => { navigate("/register"); setMenuOpen(false); }}>Get Started</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}