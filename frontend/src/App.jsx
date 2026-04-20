import './App.css'
import { useState, useEffect } from "react";
import Signup from './components/sign_up'
import Login from './components/log_in'
import Profile from './pages/profile'
import Home from './pages/home'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/navigation'
import Registration from './pages/registration'

function App() {

  // ✅ make token reactive
  const [token, setToken] = useState(localStorage.getItem("token"));

  // ✅ update token when login/logout happens
  useEffect(() => {
    const checkToken = () => {
      setToken(localStorage.getItem("token"));
    };

    // run once on mount
    checkToken();

    // listen for changes (other tabs + manual trigger)
    window.addEventListener("storage", checkToken);

    return () => {
      window.removeEventListener("storage", checkToken);
    };
  }, []);

  return (
    <main>
      <Navbar />

      <Routes>

        {/* 🔐 Home */}
        <Route
          path="/"
          element={token ? <Home /> : <Navigate to="/registration" />}
        />

        {/* 🔑 Login */}
        <Route
          path="/login"
          element={!token ? <Login /> : <Navigate to="/" />}
        />

        {/* 📝 Signup */}
        <Route
          path="/signup"
          element={!token ? <Signup /> : <Navigate to="/" />}
        />

        {/* 👤 Profile */}
        <Route
          path="/profile"
          element={token ? <Profile /> : <Navigate to="/registration" />}
        />

        {/* 📄 Registration */}
        <Route
          path="/registration"
          element={<Registration />}
        />

      </Routes>
    </main>
  )
}

export default App;