import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function OAuth2Callback() {
  const navigate = useNavigate();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const p = new URLSearchParams(window.location.search);
    const accessToken  = p.get("accessToken");
    const refreshToken = p.get("refreshToken");
    const name         = p.get("name");
    const picture      = p.get("picture");
    const error        = p.get("error");

    if (error) {
      toast.error("Google login failed ❌");
      setTimeout(() => navigate("/login", { replace: true }), 1500);
      return;
    }

    if (accessToken && refreshToken) {
      localStorage.setItem("accessToken",  accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      if (name)    localStorage.setItem("userName",    name);
      if (picture) localStorage.setItem("userPicture", picture);

      // KEY FIX: set a flag so the HOME page shows the toast, not this page
      // This avoids the unmount-before-render issue entirely
      sessionStorage.setItem("pendingToast", "Signed in with Google 🎉");
      window.dispatchEvent(new Event("auth:update"));
      navigate("/home", { replace: true });
    } else {
      toast.error("Google login failed — no tokens received.");
      setTimeout(() => navigate("/login", { replace: true }), 1500);
    }
  }, [navigate]);

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(145deg, #e8e4ff, #d4ccff)",
      fontFamily: "'DM Sans', sans-serif",
      color: "#6048BF",
      fontSize: "1rem",
      gap: "0.75rem"
    }}>
      <svg width="28" height="28" viewBox="0 0 24 24"
        fill="none" stroke="#6048BF" strokeWidth="2.5"
        style={{ animation: "spin 0.8s linear infinite" }}>
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
      </svg>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <span>Completing Google sign in…</span>
    </div>
  );
}

export default OAuth2Callback;