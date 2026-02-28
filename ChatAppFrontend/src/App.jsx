import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./components/landing";
import Navbar from "./components/Navbar";
import Register from "./components/Register";
import Home from "./components/Home";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route element={<Navbar/>}/>
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;