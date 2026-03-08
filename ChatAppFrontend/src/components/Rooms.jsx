import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import CreateRoomModal from "./CreateRoomModal";
import "./Rooms.css";

export default function Rooms() {
  const navigate = useNavigate();

  const [publicRooms,  setPublicRooms]  = useState([]);
  const [privateRooms, setPrivateRooms] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [tab,          setTab]          = useState("public"); // "public" | "private"
  const [search,       setSearch]       = useState("");
  const [showCreate,   setShowCreate]   = useState(false);
  const [privateInput, setPrivateInput] = useState("");

  const fetchRooms = async () => {
    setLoading(true);
      try {
        const [pubRes, privRes] = await Promise.all([
          API.get("/chat/room/public"),
          API.get("/chat/room/private"),
        ]);
        setPublicRooms(pubRes.data  || []);
        setPrivateRooms(privRes.data || []);
      } catch (err) {
        console.error("Failed to fetch rooms:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRooms(); }, []);

  const filtered = (tab === "public" ? publicRooms : privateRooms).filter(r =>
    r.roomId?.toLowerCase().includes(search.toLowerCase()) ||
    r.category?.toLowerCase().includes(search.toLowerCase()) ||
    r.purpose?.toLowerCase().includes(search.toLowerCase())
  );

  const handleJoinPrivate = () => {
    const id = privateInput.trim().toUpperCase();
    if (!id) return;
    navigate(`/roomlogin?roomId=${id}`);
  };

  const handleJoinPublic = (roomId) => {
    navigate(`/roomlogin?roomId=${roomId}`);
  };

  // Icons for variety
  const ICONS = ["💬","🚀","🎮","🎵","💡","🌍","🔥","⚡","🎨","📚"];
  const getIcon = (roomId) => ICONS[roomId?.charCodeAt(0) % ICONS.length] || "💬";

  return (
    <div className="rooms">
      <div className="rooms__bg">
        <div className="rooms__orb rooms__orb--1" />
        <div className="rooms__orb rooms__orb--2" />
        <div className="rooms__grid" />
      </div>

      <div className="rooms__inner">

        {/* ── Page header ── */}
        <div className="rooms__header">
          <div className="rooms__header-badge">
            <span className="rooms__badge-dot" />
            {publicRooms.length + privateRooms.length} rooms available
          </div>
          <h1 className="rooms__title">Find your room</h1>
          <p className="rooms__sub">
            Browse public rooms open to everyone, or enter a private room ID to join a closed space.
          </p>
        </div>

        {/* ── Private Room Quick Join ── */}
        <div className="rooms__private-banner">
          <div className="rooms__private-banner-text">
            <div className="rooms__private-icon">🔐</div>
            <div>
              <h3>Have a private room ID?</h3>
              <p>Enter it below to join directly — no browsing needed.</p>
            </div>
          </div>
          <div className="rooms__private-input-row">
            <div className="rooms__private-input-wrap">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <input
                type="text"
                placeholder="e.g. ROOM-XK92"
                value={privateInput}
                onChange={e => setPrivateInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleJoinPrivate()}
              />
            </div>
            <button className="rooms__private-btn" onClick={handleJoinPrivate} disabled={!privateInput.trim()}>
              Join Private Room
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>

        {/* ── Tabs + Search ── */}
        <div className="rooms__controls">
          <div className="rooms__tabs">
            <button
              className={`rooms__tab ${tab === "public" ? "rooms__tab--active" : ""}`}
              onClick={() => setTab("public")}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              Public Rooms
              <span className="rooms__tab-count">{publicRooms.length}</span>
            </button>
            <button
              className={`rooms__tab ${tab === "private" ? "rooms__tab--active" : ""}`}
              onClick={() => setTab("private")}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              Private Rooms
              <span className="rooms__tab-count">{privateRooms.length}</span>
            </button>
          </div>

          <div className="rooms__search-wrap">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              placeholder="Search rooms…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="rooms__search"
            />
          </div>
        </div>

        {/* ── Room Cards ── */}
        {loading ? (
          <div className="rooms__loading">
            <div className="rooms__spinner" />
            Loading rooms…
          </div>
        ) : filtered.length === 0 ? (
          <div className="rooms__empty">
            <span className="rooms__empty-icon">🔍</span>
            <p>{search ? "No rooms match your search." : tab === "public" ? "No public rooms yet." : "No private rooms found."}</p>
          </div>
        ) : (
          <div className="rooms__grid-cards">
            {filtered.map((room) => (
              <div className="rooms__card" key={room.id}>
                <div className="rooms__card-top">
                  <div className="rooms__card-icon">{getIcon(room.roomId)}</div>
                  <div className={`rooms__card-badge ${room.isPrivate ? "rooms__card-badge--private" : "rooms__card-badge--public"}`}>
                    {room.isPrivate ? "🔒 Private" : "🌐 Public"}
                  </div>
                </div>

                <div className="rooms__card-body">
                  <h3 className="rooms__card-name">{room.roomId}</h3>
                  {room.purpose && <p className="rooms__card-purpose">{room.purpose}</p>}
                  {room.category && (
                    <div className="rooms__card-category">
                      <span>{room.category}</span>
                    </div>
                  )}
                </div>

                <div className="rooms__card-footer">
                  {room.isPrivate ? (
                    <button
                      className="rooms__card-btn rooms__card-btn--private"
                      onClick={() => navigate(`/roomlogin?roomId=${room.roomId}`)}
                    >
                      Enter Room ID
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </button>
                  ) : (
                    <button
                      className="rooms__card-btn rooms__card-btn--public"
                      onClick={() => handleJoinPublic(room.roomId)}
                    >
                      Join Room
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {showCreate && (
        <CreateRoomModal
          onClose={() => setShowCreate(false)}
          onRoomCreated={() => { setShowCreate(false); fetchRooms(); }}
        />
      )}
    </div>
  );
}