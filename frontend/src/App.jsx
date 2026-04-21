import './App.css'
import { useState, useEffect } from "react";
import Signup from './components/sign_up'
import Login from './components/log_in'
import Home from './pages/home'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/navigation'
import Registration from './pages/registration'

function App() {

  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const checkToken = () => {
      setToken(localStorage.getItem("token"));
    };

    window.addEventListener("storage", checkToken);
    return () => window.removeEventListener("storage", checkToken);
  }, []);

  return (
    <main>
      <Navbar />

      <Routes>

        <Route
          path="/"
          element={token ? <Home /> : <Navigate to="/registration" />}
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