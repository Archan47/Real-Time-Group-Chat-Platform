import { useNavigate } from "react-router-dom";
import "./Landing.css";
import Navbar from "./Navbar";

function Landing() {
  const navigate = useNavigate();

  return (

    <div className="landing">
        <Navbar/>
      <div className="card">
        <h1>Welcome to ChatSphere</h1>
        <p>Real-Time Group Chat Platform</p>
        <button onClick={() => navigate("/register")}>
          Get Started
        </button>
      </div>
    </div>
  );
}

export default Landing;