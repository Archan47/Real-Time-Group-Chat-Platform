import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const [form,    setForm]    = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await API.post("/api/auth/login", form);
      if (response.status === 200) {
        const { accessToken, refreshToken } = response.data;

        // 1. Store tokens
        localStorage.setItem("accessToken",  accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        // 2. Fire custom event so Navbar updates INSTANTLY (same tab)
        window.dispatchEvent(new Event("auth:update"));

        // 3. Store pending toast for Home to display
        sessionStorage.setItem("pendingToast", "Welcome back! 🎉");

        // 4. Navigate to home
        navigate("/home");
      }
    } catch (error) {
      if (error.response) {
        const msg = error.response.data?.message || error.response.data?.error || "Invalid email or password ❌";
        toast.error(typeof msg === "string" ? msg : "Login failed ❌");
      } else if (error.request) {
        toast.error("Cannot reach server. Check if backend is running.");
      } else {
        toast.error("Login failed ❌");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8070/oauth2/authorization/google";
  };

  return (
    <div className="login">
      <div className="login__orb-top" />
      <div className="login__orb-bottom" />
      <form onSubmit={handleSubmit} className="login-card">
        <div className="login-card__logo">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
            <path d="M20 2H4C2.9 2 2 2.9 2 4v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
          </svg>
        </div>
        <h2>Welcome back</h2>
        <p className="login-card__subtitle">Sign in to continue to Convex.</p>

        <button type="button" className="login-card__google-btn" onClick={handleGoogleLogin}>
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          Continue with Google
        </button>

        <div className="login-card__divider"><span>or sign in with email</span></div>

        <div className="login-card__field">
          <label htmlFor="login-email">Email</label>
          <div className="login-card__input-wrap">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            <input id="login-email" type="email" name="email" placeholder="you@example.com"
              onChange={handleChange} required autoComplete="email" />
          </div>
        </div>

        <div className="login-card__field">
          <div className="login-card__field-header">
            <label htmlFor="login-password">Password</label>
            <a href="/forgot-password" className="login-card__forgot">Forgot password?</a>
          </div>
          <div className="login-card__input-wrap">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            <input id="login-password" type="password" name="password" placeholder="Your password"
              onChange={handleChange} required autoComplete="current-password" />
          </div>
        </div>

        <button type="submit" className="login-card__submit" disabled={loading}>
          {loading ? (
            <><span className="login-card__spinner" />Signing in…</>
          ) : (
            <>Sign in <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg></>
          )}
        </button>

        <p className="login-card__footer">
          Don't have an account?<a href="/register"> Create one</a>
        </p>
      </form>
    </div>
  );
}

export default Login;