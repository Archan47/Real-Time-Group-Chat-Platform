import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./Home.css";

export default function Home() {
  const navigate  = useNavigate();
  const heroRef   = useRef(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check auth
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token);

    // Show any pending toast (set by Login or OAuth2Callback before redirect)
    const pendingToast = sessionStorage.getItem("pendingToast");
    if (pendingToast) {
      sessionStorage.removeItem("pendingToast");
      // Small delay so ToastContainer is fully mounted
      setTimeout(() => toast.success(pendingToast), 100);
    }
  }, []);

  // Parallax orbs
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const handleMove = (e) => {
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth  - 0.5) * 30;
      const y = (clientY / window.innerHeight - 0.5) * 30;
      hero.querySelectorAll(".home__orb").forEach((orb, i) => {
        const factor = (i + 1) * 0.4;
        orb.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
      });
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  const features = [
    { icon: "⚡", title: "Real-time Messaging",   desc: "Zero-latency communication powered by WebSocket. Every message arrives instantly." },
    { icon: "🔒", title: "End-to-End Secure",     desc: "JWT authentication with refresh tokens. Your conversations stay private, always." },
    { icon: "🚪", title: "Private Rooms",         desc: "Create or join rooms with a unique ID. Full control over who joins your space." },
    { icon: "🌐", title: "OAuth Login",           desc: "Sign in with Google in one click. No extra passwords to remember." },
    { icon: "📧", title: "Smart Notifications",   desc: "Email alerts for logins, resets, and new messages — keeping you always in the loop." },
    { icon: "🎨", title: "Sleek Interface",       desc: "A minimal, distraction-free UI built for focus. Looks great on any device." },
  ];

  return (
    <div className="home">

      {/* ── HERO ── */}
      <section className="home__hero" ref={heroRef}>
        <div className="home__orb home__orb--1" />
        <div className="home__orb home__orb--2" />
        <div className="home__orb home__orb--3" />
        <div className="home__orb home__orb--4" />
        <div className="home__grid-overlay" />

        <div className="home__hero-content">
          <div className="home__badge">
            <span className="home__badge-dot" />
            Chat. Connect. Create.
          </div>

          <h1 className="home__headline">
            Talk to anyone,<br />
            <span className="home__headline-accent">anywhere.</span>
          </h1>

          <p className="home__subline">
            Convex brings your conversations to life — real-time rooms,
            secure auth, and a beautiful experience you'll actually enjoy using.
          </p>

          <div className="home__cta-group">
            {isLoggedIn ? (
              /* ── LOGGED IN: show Start Conversation ── */
              <button
                className="home__cta home__cta--primary"
                onClick={() => navigate("/roomlogin")}
              >
                Start your conversation
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            ) : (
              /* ── LOGGED OUT: show Login only ── */
              <>
                <button
                  className="home__cta home__cta--primary"
                  onClick={() => navigate("/login")}
                >
                  Sign in to chat
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
                <button
                  className="home__cta home__cta--ghost"
                  onClick={() => navigate("/register")}
                >
                  Create account
                </button>
              </>
            )}
          </div>

          <div className="home__social-proof">
            <div className="home__avatars">
              {["#8D7BFF","#6048BF","#B9AEFF","#E5E1FF"].map((c, i) => (
                <div key={i} className="home__avatar" style={{ background: c, zIndex: 4 - i }} />
              ))}
            </div>
            <span>Join <strong>2,400+</strong> users already chatting</span>
          </div>
        </div>

        {/* Hero visual */}
        <div className="home__hero-visual">
          <div className="home__chat-mock">
            <div className="home__chat-mock-header">
              <div className="home__chat-mock-dot" style={{ background: "#ff5f57" }} />
              <div className="home__chat-mock-dot" style={{ background: "#febc2e" }} />
              <div className="home__chat-mock-dot" style={{ background: "#28c840" }} />
              <span>Room · general</span>
            </div>
            <div className="home__chat-mock-body">
              {[
                { self: false, text: "Hey, is anyone here? 👋",        delay: "0s" },
                { self: true,  text: "Yeah! Welcome to Convex 🎉",     delay: "0.15s" },
                { self: false, text: "This is so fast, wow!",           delay: "0.3s" },
                { self: true,  text: "Real-time WebSocket magic ⚡",    delay: "0.45s" },
                { self: false, text: "Love the design btw 💜",          delay: "0.6s" },
              ].map((msg, i) => (
                <div key={i}
                  className={`home__chat-bubble ${msg.self ? "home__chat-bubble--self" : ""}`}
                  style={{ animationDelay: msg.delay }}
                >
                  {msg.text}
                </div>
              ))}
            </div>
            <div className="home__chat-mock-input">
              <div className="home__chat-mock-field">Type a message…</div>
              <div className="home__chat-mock-send">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2 21l21-9L2 3v7l15 2-15 2z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="home__features" id="features">
        <div className="home__features-inner">
          <div className="home__section-label">Why Convex</div>
          <h2 className="home__section-title">Everything you need<br />to communicate better</h2>
          <div className="home__features-grid">
            {features.map((f, i) => (
              <div className="home__feature-card" key={i} style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="home__feature-icon">{f.icon}</div>
                <h3 className="home__feature-title">{f.title}</h3>
                <p className="home__feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="home__banner">
        <div className="home__banner-orb home__banner-orb--1" />
        <div className="home__banner-orb home__banner-orb--2" />
        <div className="home__banner-inner">
          <h2 className="home__banner-title">Ready to start talking?</h2>
          <p className="home__banner-sub">Create your free account in seconds. No credit card needed.</p>
          <button className="home__cta home__cta--white" onClick={() => navigate(isLoggedIn ? "/roomlogin" : "/register")}>
            {isLoggedIn ? "Start a room" : "Create free account"}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="home__footer">
        <div className="home__footer-inner">
          <div className="home__logo-footer">
            <div className="home__logo-icon-sm">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M20 2H4C2.9 2 2 2.9 2 4v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
              </svg>
            </div>
            Convex
          </div>
          <p className="home__footer-copy">© 2025 Convex. Built with ♥ and Spring Boot.</p>
        </div>
      </footer>
    </div>
  );
}