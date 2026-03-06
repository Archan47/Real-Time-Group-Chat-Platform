import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register       from "./components/Register";
import RoomLogin      from "./components/RoomLogin";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home           from "./components/Home";
import Navbar         from "./components/Navbar";
import Login          from "./components/Login";
import OAuth2Callback from "./auth/Oauth2Callback";
import Rooms          from "./components/Rooms";

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
        <Route path="/roomlogin"       element={<RoomLogin />} />
        <Route path="/rooms"           element={<Rooms />} />
        <Route path="/oauth2/callback" element={<OAuth2Callback />} />
      </Routes>
    </Router>
  );
}

export default App;