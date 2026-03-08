import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home           from "./components/Home";
import Navbar         from "./components/Navbar";
import Register       from "./components/Register";
import Login          from "./components/Login";
import RoomLogin      from "./components/RoomLogin";
import Rooms          from "./components/Rooms";
import { ProfileSection } from "./components/ProfileSection";
import OAuth2Callback from "./auth/Oauth2Callback";

function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <Navbar />
      <Routes>
        <Route path="/"                element={<Home />} />
        <Route path="/home"            element={<Home />} />
        <Route path="/register"        element={<Register />} />
        <Route path="/login"           element={<Login />} />
        <Route path="/rooms"           element={<Rooms />} />
        <Route path="/roomlogin"       element={<RoomLogin />} />
        <Route path="/profile"         element={<ProfileSection />} />
        <Route path="/oauth2/callback" element={<OAuth2Callback />} />
      </Routes>
    </Router>
  );
}

export default App;