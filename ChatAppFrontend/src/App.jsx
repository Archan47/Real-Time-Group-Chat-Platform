import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./components/Register";
import RoomLogin from "./components/RoomLogin";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./components/Home";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <ToastContainer />
      <Navbar/>
      <Routes> 
        <Route path="/register" element={<Register />} />
        <Route path="/roomlogin" element={<RoomLogin />} />
        <Route path="/" element={<Home/>}/>
      </Routes>
    </Router>
  );
}

export default App;