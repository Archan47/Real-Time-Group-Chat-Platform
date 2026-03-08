import { useState } from "react";
import API from "../services/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./CreateRoomModal.css";

const CATEGORIES = [
  "General", "Sports", "Education", "Music",
  "Gaming", "Technology", "Politics", "Health",
  "Movies", "Other"
];

// Decode JWT to get userId
function getUserIdFromToken() {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1]));
    // Try common JWT claims for ID
    return payload.userId || payload.id || payload.sub || null;
  } catch { return null; }
}

export default function CreateRoomModal({ onClose, onRoomCreated }) {
  const navigate  = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    roomId:      "",
    category:    "",
    purpose:     "",
    isPrivate:   false,
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.roomId.trim())   e.roomId   = "Room ID is required";
    if (form.roomId.includes(" ")) e.roomId = "Room ID cannot contain spaces";
    if (!form.category)        e.category = "Select a category";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const userId = getUserIdFromToken();
    if (!userId) {
      toast.error("Session expired — please log in again");
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      await API.post("/chat/room/create", {
        roomId:      form.roomId.trim().toUpperCase(),
        userId,
        privateRoom: form.isPrivate,
        category:    form.category,
        purpose:     form.purpose.trim(),
      });
      toast.success(`Room "${form.roomId.toUpperCase()}" created! 🚀`);
      onRoomCreated?.();
      onClose();
    } catch (err) {
      const msg = err.response?.data || err.response?.data?.message || "Failed to create room";
      toast.error(typeof msg === "string" ? msg : "Failed to create room");
    } finally {
      setLoading(false);
    }
  };

  const genRoomId = () => {
    const id = Math.random().toString(36).substring(2, 7).toUpperCase();
    setForm(prev => ({ ...prev, roomId: id }));
    if (errors.roomId) setErrors(prev => ({ ...prev, roomId: "" }));
  };

  return (
    <div className="crm__overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="crm__modal">

        {/* Header */}
        <div className="crm__header">
          <div className="crm__header-left">
            <div className="crm__header-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </div>
            <div>
              <h2 className="crm__title">Create a Room</h2>
              <p className="crm__subtitle">Set up your space and invite others.</p>
            </div>
          </div>
          <button className="crm__close" onClick={onClose} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="crm__body">

          {/* Room ID */}
          <div className="crm__field">
            <div className="crm__label-row">
              <label className="crm__label" htmlFor="crm-roomId">Room ID <span className="crm__required">*</span></label>
              <button type="button" className="crm__gen-btn" onClick={genRoomId}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="23 4 23 10 17 10"/>
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                </svg>
                Auto-generate
              </button>
            </div>
            <div className={`crm__input-wrap ${errors.roomId ? "crm__input-wrap--error" : ""}`}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <input
                id="crm-roomId" name="roomId" type="text"
                placeholder="e.g. TECHROOM or MYCLUB"
                value={form.roomId}
                onChange={handleChange}
                className="crm__input"
                autoComplete="off"
                maxLength={20}
              />
              <span className="crm__char-count">{form.roomId.length}/20</span>
            </div>
            {errors.roomId && <p className="crm__error">{errors.roomId}</p>}
            <p className="crm__hint">Unique identifier. Will be converted to uppercase.</p>
          </div>

          {/* Category */}
          <div className="crm__field">
            <label className="crm__label" htmlFor="crm-category">
              Category <span className="crm__required">*</span>
            </label>
            <div className={`crm__input-wrap ${errors.category ? "crm__input-wrap--error" : ""}`}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 6h16M4 12h16M4 18h7"/>
              </svg>
              <select
                id="crm-category" name="category"
                value={form.category}
                onChange={handleChange}
                className="crm__select"
              >
                <option value="">Select a category…</option>
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            {errors.category && <p className="crm__error">{errors.category}</p>}
          </div>

          {/* Purpose */}
          <div className="crm__field">
            <label className="crm__label" htmlFor="crm-purpose">
              Purpose <span className="crm__optional">(optional)</span>
            </label>
            <textarea
              id="crm-purpose" name="purpose"
              placeholder="What's this room for? e.g. Weekly team sync, sports discussion…"
              value={form.purpose}
              onChange={handleChange}
              className="crm__textarea"
              rows={3}
              maxLength={120}
            />
            <p className="crm__hint">{form.purpose.length}/120</p>
          </div>

          {/* Privacy toggle */}
          <div className="crm__privacy-card">
            <div className="crm__privacy-info">
              <div className="crm__privacy-icon">
                {form.isPrivate
                  ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                }
              </div>
              <div>
                <h4 className="crm__privacy-title">
                  {form.isPrivate ? "Private Room" : "Public Room"}
                </h4>
                <p className="crm__privacy-desc">
                  {form.isPrivate
                    ? "Only people with the Room ID can find and join."
                    : "Visible to all users in the Rooms listing."}
                </p>
              </div>
            </div>
            <label className="crm__toggle">
              <input
                type="checkbox"
                name="isPrivate"
                checked={form.isPrivate}
                onChange={handleChange}
              />
              <span className="crm__toggle-track">
                <span className="crm__toggle-thumb" />
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="crm__actions">
            <button type="button" className="crm__cancel-btn" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="crm__submit-btn" disabled={loading}>
              {loading
                ? <><span className="crm__spinner" />Creating…</>
                : <><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>Create Room</>
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}