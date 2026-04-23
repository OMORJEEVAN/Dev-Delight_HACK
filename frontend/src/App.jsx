import './App.css'
import { useState, useEffect } from "react";
import Signup from './components/sign_up'
import Login from './components/log_in'
import Home from './pages/home'
import Navbar from './components/navigation'
import Registration from './pages/registration'
import About from './pages/About'   //ADD THIS
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

function App() {

  const [token, setToken] = useState(localStorage.getItem("token"));
  const [view, setView] = useState("all");
  const location = useLocation();

  useEffect(() => {
    const checkToken = () => {
      setToken(localStorage.getItem("token"));
    };

    window.addEventListener("storage", checkToken);
    return () => window.removeEventListener("storage", checkToken);
  }, []);

  return (
    <main>

      {/* Navbar only on Home + Registration (UNCHANGED) */}
      {(location.pathname === "/home" || location.pathname === "/registration") && (
        <Navbar view={view} />
      )}

      <Routes>

         <Route
          path="/about"
          element={<About />}
        />

        <Route
          path="/"
          element={<Navigate to="/about" />}
        />

        <Route
          path="/home"
          element={token ? <Home view={view} setView={setView} /> : <Navigate to="/registration" />}
        />

        <Route
          path="/login"
          element={!token ? <Login /> : <Navigate to="/" />}
        />

        <Route
          path="/signup"
          element={!token ? <Signup /> : <Navigate to="/" />}
        />

        <Route
          path="/registration"
          element={<Registration />}
        />

      </Routes>
    </main>
  )
}

export default App;