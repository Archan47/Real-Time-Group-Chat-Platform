import { useState } from "react";
import "./Home.css";

export default function Home() {
    const [name, setName] = useState("");
    const [roomId, setRoomId] = useState("");

    const handleJoin = () => {
        if (!name || !roomId) {
            alert("Please enter both fields");
            return;
        }
        console.log("Joining room:", roomId, "as", name);
    };

    const handleCreate = () => {
        if (!name || !roomId) {
            alert("Please enter both fields");
            return;
        }
        console.log("Creating room:", roomId);
    };

    return (
        <div className="home-container">
            {/* Animated Background Elements */}
            <div className="background-animation">
                <div className="floating-shapes">
                    <div className="shape shape-1"></div>
                    <div className="shape shape-2"></div>
                    <div className="shape shape-3"></div>
                    <div className="shape shape-4"></div>
                    <div className="shape shape-5"></div>
                    <div className="shape shape-6"></div>
                </div>
                <div className="gradient-orbs">
                    <div className="orb orb-1"></div>
                    <div className="orb orb-2"></div>
                    <div className="orb orb-3"></div>
                </div>
            </div>

            <div className="card">
                <div className="card-glow"></div>
                <div className="card-info">
                    <h1 className="title">Let's Start Talking...</h1>
                    <p className="subtitle">Connect instantly in your own rooms</p>
                    
                    <div className="input-group">
                        <label>Your Name</label>
                        <div className="input-wrapper">
                            <input
                                type="text"
                                placeholder="Enter your name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <div className="input-border"></div>
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Room ID</label>
                        <div className="input-wrapper">
                            <input
                                type="text"
                                placeholder="Enter room ID"
                                value={roomId}
                                onChange={(e) => setRoomId(e.target.value)}
                            />
                            <div className="input-border"></div>
                        </div>
                    </div>

                    <div className="button-group">
                        <button className="join-btn" onClick={handleJoin}>
                            <span>Join Room</span>
                            <div className="btn-glow"></div>
                        </button>
                        <button className="create-btn" onClick={handleCreate}>
                            <span>Create Room</span>
                            <div className="btn-glow"></div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}