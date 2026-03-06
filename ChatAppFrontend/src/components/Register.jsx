import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";
import "./Register.css";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await API.post("/api/users/register", form);
      if (response.status === 201 || response.status === 200) {
        toast.success("Registration Successful 🎉");
        setTimeout(() => navigate("/"), 1500);
      }
    } catch (error) {
      console.error("Registration error:", error);
      if (error.response) {
        const msg = error.response.data?.message || error.response.data || "Registration Failed ❌";
        toast.error(typeof msg === "string" ? msg : "Registration Failed ❌");
      } else if (error.request) {
        toast.error("Cannot reach server. Check if backend is running.");
      } else {
        toast.error("Registration Failed ❌");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register">
      {/* Bottom decorative orb */}
      <div className="register__orb-bottom" />

      <form onSubmit={handleSubmit} className="register-card">

        {/* Logo mark */}
        <div className="register-card__logo">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
            <path d="M20 2H4C2.9 2 2 2.9 2 4v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
          </svg>
        </div>

        <h2>Create account</h2>
        <p className="register-card__subtitle">Join Convex — it's free forever.</p>

        {/* Name */}
        <div className="register-card__field">
          <label htmlFor="name">Full Name</label>
          <div className="register-card__input-wrap">
            <input
              id="name"
              type="text"
              name="name"
              placeholder="Your full name"
              onChange={handleChange}
              required
              autoComplete="name"
            />
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{position:'absolute',left:'0.9rem',pointerEvents:'none'}}>
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
        </div>

        {/* Email */}
        <div className="register-card__field">
          <label htmlFor="email">Email</label>
          <div className="register-card__input-wrap">
            <input
              id="email"
              type="email"
              name="email"
              placeholder="you@example.com"
              onChange={handleChange}
              required
              autoComplete="email"
            />
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{position:'absolute',left:'0.9rem',pointerEvents:'none'}}>
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
          </div>
        </div>

        {/* Password */}
        <div className="register-card__field">
          <label htmlFor="password">Password</label>
          <div className="register-card__input-wrap">
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Min. 8 characters"
              onChange={handleChange}
              required
              autoComplete="new-password"
            />
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{position:'absolute',left:'0.9rem',pointerEvents:'none'}}>
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
        </div>

        {/* Submit */}
        <button type="submit" disabled={loading}>
          {loading ? (
            <>
              <span className="register-card__spinner" />
              Creating account…
            </>
          ) : (
            <>
              Create account
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </>
          )}
        </button>

        {/* Footer */}
        <p className="register-card__footer">
          Already have an account?
          <a href="/login">Sign in</a>
        </p>
      </form>
    </div>
  );
}

export default Register;