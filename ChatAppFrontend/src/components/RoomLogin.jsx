import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import CreateRoomModal from "./CreateRoomModal";
import "./RoomLogin.css";

export default function RoomLogin() {
  const [name,        setName]        = useState("");
  const [roomId,      setRoomId]      = useState("");
  const [showCreate,  setShowCreate]  = useState(false);
  const navigate     = useNavigate();
  const [searchParams] = useSearchParams();

  // Pre-fill roomId if coming from /rooms page
  useState(() => {
    const id = searchParams.get("roomId");
    if (id) setRoomId(id);
  });

  const handleJoin = () => {
    if (!name || !roomId) return;
    navigate(`/chat/${roomId.trim().toUpperCase()}?name=${encodeURIComponent(name)}`);
  };

  return (
    <div className="rl">
      {/* Background */}
      <div className="rl__bg">
        <div className="rl__orb rl__orb--1" />
        <div className="rl__orb rl__orb--2" />
        <div className="rl__orb rl__orb--3" />
        <div className="rl__grid" />
      </div>

      {/* Card */}
      <div className="rl__card">

        {/* Left panel */}
        <div className="rl__panel">
          <div className="rl__panel-logo">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
              <path d="M20 2H4C2.9 2 2 2.9 2 4v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
            </svg>
          </div>
          <h2 className="rl__panel-title">Let's start<br/>talking.</h2>
          <p className="rl__panel-sub">Rooms are instant. No setup, no waiting. Just enter and connect.</p>

          <div className="rl__panel-features">
            {[
              { icon: "⚡", text: "Instant connection" },
              { icon: "🔒", text: "Private by default" },
              { icon: "🌍", text: "Share with anyone" },
            ].map((f, i) => (
              <div className="rl__panel-feature" key={i}>
                <span>{f.icon}</span><span>{f.text}</span>
              </div>
            ))}
          </div>

          <div className="rl__panel-preview">
            <div className="rl__preview-msg rl__preview-msg--in">You in? 🚀</div>
            <div className="rl__preview-msg rl__preview-msg--out">Always. Let's go!</div>
          </div>
        </div>

        {/* Right panel */}
        <div className="rl__form-panel">
          <h1 className="rl__form-title">Join a room</h1>
          <p className="rl__form-sub">Enter your name and a room ID to get started.</p>

          <div className="rl__field">
            <label>Your Name</label>
            <div className="rl__input-wrap">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              <input
                type="text" placeholder="e.g. username"
                value={name} onChange={e => setName(e.target.value)}
              />
            </div>
          </div>

          <div className="rl__field">
            <label>Room ID</label>
            <div className="rl__input-wrap">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <input
                type="text" placeholder="e.g. TECHROOM"
                value={roomId} onChange={e => setRoomId(e.target.value.toUpperCase())}
              />
            </div>
          </div>

          <div className="rl__buttons">
            <button className="rl__btn rl__btn--join" onClick={handleJoin} disabled={!name || !roomId}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                <polyline points="10 17 15 12 10 7"/>
                <line x1="15" y1="12" x2="3" y2="12"/>
              </svg>
              Join Room
            </button>
            <button className="rl__btn rl__btn--create" onClick={() => setShowCreate(true)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Create Room
            </button>
          </div>

          <p className="rl__back">
            <button onClick={() => navigate("/rooms")} className="rl__back-btn">
              ← Back to rooms
            </button>
          </p>
        </div>
      </div>

      {/* Create Room Modal */}
      {showCreate && (
        <CreateRoomModal
          onClose={() => setShowCreate(false)}
          onRoomCreated={() => navigate("/rooms")}
        />
      )}
    </div>
  );
}