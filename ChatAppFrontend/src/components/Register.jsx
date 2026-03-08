import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";
import "./Register.css";

function Register() {
  const navigate  = useNavigate();
  const fileRef   = useRef(null);

  const [form,    setForm]    = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [picB64,  setPicB64]  = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast.error("Image must be under 2MB"); return; }
    const reader = new FileReader();
    reader.onload = (ev) => { setPreview(ev.target.result); setPicB64(ev.target.result); };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form };
      if (picB64) payload.profilePicBase64 = picB64;

      // Single call — register returns tokens directly now
      const res = await API.post("/api/users/register", payload);
      const data = res.data;

      // Store tokens from register response
      localStorage.setItem("accessToken",  data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("userName",     data.name || form.name);
      if (picB64) localStorage.setItem("userPicture", picB64);

      // Notify Navbar instantly
      window.dispatchEvent(new Event("auth:update"));

      // Toast shown on Home page
      sessionStorage.setItem("pendingToast", `Welcome to Convex, ${data.name || form.name}! 🎉`);

      navigate("/home");

    } catch (error) {
      const msg =
        error.response?.data?.message ||
        (typeof error.response?.data === "string" ? error.response.data : null) ||
        "Registration failed. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register">
      <div className="register__orb-bottom" />

      <form onSubmit={handleSubmit} className="register-card">

        <div className="register-card__logo">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
            <path d="M20 2H4C2.9 2 2 2.9 2 4v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
          </svg>
        </div>

        <h2>Create account</h2>
        <p className="register-card__subtitle">Join Convex — it's free forever.</p>

        {/* ── Profile Photo Upload ── */}
        <div className="register-card__avatar-section">
          <div className="register-card__avatar-ring" onClick={() => fileRef.current.click()}>
            {preview ? (
              <img src={preview} alt="Preview" className="register-card__avatar-preview" />
            ) : (
              <div className="register-card__avatar-placeholder">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
            )}
            <div className="register-card__avatar-overlay">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
            </div>
          </div>
          <p className="register-card__avatar-hint">
            {preview ? "Click to change · max 2MB" : "Upload profile photo (optional)"}
          </p>
          <input ref={fileRef} type="file" accept="image/*"
            style={{ display: "none" }} onChange={handleFileChange} />
        </div>

        {/* Name */}
        <div className="register-card__field">
          <label htmlFor="reg-name">Full Name</label>
          <div className="register-card__input-wrap">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            <input id="reg-name" type="text" name="name" placeholder="Your full name"
              onChange={handleChange} required autoComplete="name" />
          </div>
        </div>

        {/* Email */}
        <div className="register-card__field">
          <label htmlFor="reg-email">Email</label>
          <div className="register-card__input-wrap">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            <input id="reg-email" type="email" name="email" placeholder="you@example.com"
              onChange={handleChange} required autoComplete="email" />
          </div>
        </div>

        {/* Password */}
        <div className="register-card__field">
          <label htmlFor="reg-password">Password</label>
          <div className="register-card__input-wrap">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            <input id="reg-password" type="password" name="password" placeholder="Min. 8 characters"
              onChange={handleChange} required autoComplete="new-password" />
          </div>
        </div>

        <button type="submit" disabled={loading}>
          {loading
            ? <><span className="register-card__spinner" />Creating account…</>
            : <>Create account
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </>
          }
        </button>

        <p className="register-card__footer">
          Already have an account?<a href="/login"> Log in</a>
        </p>
      </form>
    </div>
  );
}

export default Register;