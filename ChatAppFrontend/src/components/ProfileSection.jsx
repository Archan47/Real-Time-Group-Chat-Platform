import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";
import "./ProfileSection.css";

export const ProfileSection = () => {
  const navigate = useNavigate();
  const fileRef  = useRef(null);

  const [user,      setUser]      = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [saving,    setSaving]    = useState(false);
  const [editName,  setEditName]  = useState("");
  const [preview,   setPreview]   = useState(null);
  const [newPicB64, setNewPicB64] = useState("");
  const [activeTab, setActiveTab] = useState("profile");

  // Password form
  const [pwForm,    setPwForm]    = useState({ newPw: "", confirm: "" });
  const [pwLoading, setPwLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) { navigate("/login"); return; }
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await API.get("/api/users/me");
      setUser(res.data);
      setEditName(res.data.name || "");
      setPreview(res.data.profilePicUrl || null);
    } catch {
      toast.error("Could not load profile");
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast.error("Image must be under 2MB"); return; }
    const reader = new FileReader();
    reader.onload = (ev) => { setPreview(ev.target.result); setNewPicB64(ev.target.result); };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async () => {
    if (!editName.trim()) { toast.error("Name cannot be empty"); return; }
    setSaving(true);
    try {
      const payload = { name: editName };
      if (newPicB64) payload.profilePicBase64 = newPicB64;
      await API.put("/api/users/me", payload);
      localStorage.setItem("userName", editName);
      if (newPicB64) localStorage.setItem("userPicture", newPicB64);
      toast.success("Profile updated ✅");
      setNewPicB64("");
      await fetchProfile();
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!pwForm.newPw)                 { toast.error("Enter a new password"); return; }
    if (pwForm.newPw.length < 8)       { toast.error("Minimum 8 characters"); return; }
    if (pwForm.newPw !== pwForm.confirm){ toast.error("Passwords don't match"); return; }
    setPwLoading(true);
    try {
      await API.put("/api/users/change-password", { newPassWord: pwForm.newPw });
      toast.success("Password updated ✅");
      setPwForm({ newPw: "", confirm: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password");
    } finally {
      setPwLoading(false);
    }
  };

  const handleLogout = () => {
    ["accessToken","refreshToken","userName","userPicture"].forEach(k => localStorage.removeItem(k));
    navigate("/login");
  };

  const pwStrength = () => {
    const p = pwForm.newPw;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 8)  s++;
    if (p.length >= 12) s++;
    if (/[A-Z]/.test(p) && /[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s; // 0-4
  };

  const strengthLabel = ["","Weak","Fair","Good","Strong"];
  const strengthColor = ["","#ef4444","#f97316","#eab308","#22c55e"];

  if (loading) return (
    <div className="ps__loading">
      <div className="ps__spinner" />
      <span>Loading profile…</span>
    </div>
  );

  const initials = user?.name?.split(" ").map(w => w[0]).join("").toUpperCase().slice(0,2) || "?";
  const str = pwStrength();

  return (
    <div className="ps">
      <div className="ps__bg">
        <div className="ps__orb ps__orb--1" />
        <div className="ps__orb ps__orb--2" />
        <div className="ps__grid" />
      </div>

      <div className="ps__layout">

        {/* ══ SIDEBAR ══ */}
        <aside className="ps__sidebar">

          {/* Avatar */}
          <div className="ps__sidebar-hero">
            <div className="ps__sidebar-avatar" onClick={() => fileRef.current.click()}>
              {preview
                ? <img src={preview} alt={user.name} referrerPolicy="no-referrer" />
                : <span className="ps__sidebar-initials">{initials}</span>
              }
              <div className="ps__sidebar-avatar-overlay">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
              </div>
            </div>
            <input ref={fileRef} type="file" accept="image/*"
              style={{ display:"none" }} onChange={handleFileChange} />

            <h2 className="ps__sidebar-name">{user.name}</h2>
            <p className="ps__sidebar-email">{user.email}</p>

            <div className="ps__sidebar-badges">
              <span className="ps__badge ps__badge--role">
                <i className="fa-solid fa-shield-halved" />
                {user.role || "USER"}
              </span>
              {user.isAccountVerified && (
                <span className="ps__badge ps__badge--verified">
                  <i className="fa-solid fa-circle-check" />
                  Verified
                </span>
              )}
            </div>
          </div>

          {/* Nav */}
          <nav className="ps__sidebar-nav">
            <button
              className={`ps__nav-btn ${activeTab === "profile" ? "active" : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              <i className="fa-solid fa-circle-user" />
              <span>Profile</span>
              <i className="fa-solid fa-chevron-right ps__nav-arrow" />
            </button>
            <button
              className={`ps__nav-btn ${activeTab === "security" ? "active" : ""}`}
              onClick={() => setActiveTab("security")}
            >
              <i className="fa-solid fa-lock" />
              <span>Security</span>
              <i className="fa-solid fa-chevron-right ps__nav-arrow" />
            </button>
          </nav>

          <button className="ps__logout-btn" onClick={handleLogout}>
            <i className="fa-solid fa-right-from-bracket" />
            Sign out
          </button>
        </aside>

        {/* ══ MAIN ══ */}
        <main className="ps__main">

          {/* ── PROFILE TAB ── */}
          {activeTab === "profile" && (
            <div className="ps__panel" key="profile">
              <div className="ps__panel-header">
                <div className="ps__panel-title-row">
                  <div className="ps__panel-icon">
                    <i className="fa-solid fa-circle-user" />
                  </div>
                  <div>
                    <h1 className="ps__panel-title">Your Profile</h1>
                    <p className="ps__panel-sub">Update your name and profile photo.</p>
                  </div>
                </div>
              </div>

              {/* Photo upload */}
              <div className="ps__section">
                <label className="ps__label">Profile Photo</label>
                <div className="ps__photo-row">
                  <div className="ps__photo-thumb" onClick={() => fileRef.current.click()}>
                    {preview
                      ? <img src={preview} alt="" referrerPolicy="no-referrer" />
                      : <span>{initials}</span>
                    }
                    <div className="ps__photo-overlay">
                      <i className="fa-solid fa-camera" />
                    </div>
                  </div>
                  <div className="ps__photo-info">
                    <p>Click photo to upload a new one</p>
                    <p className="ps__photo-hint">JPG, PNG or GIF · Max 2MB</p>
                    {newPicB64 && (
                      <span className="ps__photo-changed">
                        <i className="fa-solid fa-circle-check" /> New photo selected — save to apply
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Name field */}
              <div className="ps__section">
                <label className="ps__label" htmlFor="ps-name">Display Name</label>
                <div className="ps__input-wrap">
                  <i className="fa-solid fa-user" />
                  <input
                    id="ps-name" type="text" className="ps__input"
                    value={editName} placeholder="Your display name"
                    onChange={e => setEditName(e.target.value)}
                  />
                </div>
              </div>

              {/* Email (readonly) */}
              <div className="ps__section">
                <label className="ps__label">Email Address</label>
                <div className="ps__input-wrap ps__input-wrap--locked">
                  <i className="fa-solid fa-envelope" />
                  <input type="email" className="ps__input" value={user.email} readOnly />
                  <span className="ps__lock-tag">
                    <i className="fa-solid fa-lock" /> Locked
                  </span>
                </div>
                <p className="ps__field-note">Email address cannot be changed.</p>
              </div>

              {/* Account info row */}
              <div className="ps__info-grid">
                <div className="ps__info-tile">
                  <i className="fa-solid fa-id-badge" />
                  <div>
                    <span className="ps__info-label">User ID</span>
                    <span className="ps__info-val ps__info-val--mono">{user.id?.slice(-8)}</span>
                  </div>
                </div>
                <div className="ps__info-tile">
                  <i className="fa-solid fa-shield-halved" />
                  <div>
                    <span className="ps__info-label">Role</span>
                    <span className="ps__info-val">{user.role || "USER"}</span>
                  </div>
                </div>
                <div className="ps__info-tile">
                  <i className="fa-solid fa-circle-check" />
                  <div>
                    <span className="ps__info-label">Verification</span>
                    <span className={`ps__info-val ${user.isAccountVerified ? "ps__info-val--green" : "ps__info-val--orange"}`}>
                      {user.isAccountVerified ? "Verified" : "Pending"}
                    </span>
                  </div>
                </div>
              </div>

              <button className="ps__save-btn" onClick={handleSaveProfile} disabled={saving}>
                {saving
                  ? <><span className="ps__btn-spin" />Saving…</>
                  : <><i className="fa-solid fa-floppy-disk" />Save Changes</>
                }
              </button>
            </div>
          )}

          {/* ── SECURITY TAB ── */}
          {activeTab === "security" && (
            <div className="ps__panel" key="security">
              <div className="ps__panel-header">
                <div className="ps__panel-title-row">
                  <div className="ps__panel-icon">
                    <i className="fa-solid fa-lock" />
                  </div>
                  <div>
                    <h1 className="ps__panel-title">Security</h1>
                    <p className="ps__panel-sub">Manage your password and account safety.</p>
                  </div>
                </div>
              </div>

              {/* Change password card */}
              <div className="ps__security-card">
                <div className="ps__security-card-head">
                  <div className="ps__security-icon"><i className="fa-solid fa-key" /></div>
                  <div>
                    <h3>Change Password</h3>
                    <p>Choose a strong password to keep your account safe.</p>
                  </div>
                </div>

                <div className="ps__section">
                  <label className="ps__label" htmlFor="ps-newpw">New Password</label>
                  <div className="ps__input-wrap">
                    <i className="fa-solid fa-lock" />
                    <input id="ps-newpw" type="password" className="ps__input"
                      placeholder="At least 8 characters"
                      value={pwForm.newPw}
                      onChange={e => setPwForm({...pwForm, newPw: e.target.value})} />
                  </div>
                  {/* Strength bar */}
                  {pwForm.newPw && (
                    <div className="ps__strength">
                      <div className="ps__strength-track">
                        {[1,2,3,4].map(i => (
                          <div key={i} className="ps__strength-seg"
                            style={{ background: i <= str ? strengthColor[str] : "rgba(255,255,255,0.1)" }} />
                        ))}
                      </div>
                      <span className="ps__strength-label" style={{ color: strengthColor[str] }}>
                        {strengthLabel[str]}
                      </span>
                    </div>
                  )}
                </div>

                <div className="ps__section">
                  <label className="ps__label" htmlFor="ps-confirmpw">Confirm Password</label>
                  <div className={`ps__input-wrap ${pwForm.confirm && pwForm.newPw !== pwForm.confirm ? "ps__input-wrap--error" : ""}`}>
                    <i className="fa-solid fa-lock" />
                    <input id="ps-confirmpw" type="password" className="ps__input"
                      placeholder="Repeat new password"
                      value={pwForm.confirm}
                      onChange={e => setPwForm({...pwForm, confirm: e.target.value})} />
                    {pwForm.confirm && pwForm.newPw === pwForm.confirm && (
                      <i className="fa-solid fa-circle-check ps__input-check" />
                    )}
                  </div>
                  {pwForm.confirm && pwForm.newPw !== pwForm.confirm && (
                    <p className="ps__field-error">Passwords don't match</p>
                  )}
                </div>

                <button className="ps__save-btn" onClick={handleChangePassword} disabled={pwLoading}>
                  {pwLoading
                    ? <><span className="ps__btn-spin" />Updating…</>
                    : <><i className="fa-solid fa-shield-halved" />Update Password</>
                  }
                </button>
              </div>

              {/* Danger / session */}
              <div className="ps__danger-zone">
                <div className="ps__danger-header">
                  <i className="fa-solid fa-triangle-exclamation" />
                  <h3>Sign Out</h3>
                </div>
                <p>This will clear your session and return you to the login page.</p>
                <button className="ps__danger-btn" onClick={handleLogout}>
                  <i className="fa-solid fa-right-from-bracket" />
                  Sign out now
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};