import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Login from "./components/login";     
import Register from "./components/register";
import ChessBoard from "./components/board";


function GamePage({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/");
  };

  if (!user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="game-wrapper">
      <div className="user-info">
        <span>Welcome, {user.name}!</span>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>
      <ChessBoard playerName={user.name} userId={user.id} />
    </div>
  );
}

function RegisterPage({ onStart, user }) {
  const navigate = useNavigate();

  const handleRegister = (userData) => {
    onStart(userData);
    navigate("/game");
  };

  if (user) {
    return <Navigate to="/game" />;
  }

  return <Register onRegister={handleRegister} />;
}

function LoginPage({ onStart, user }) {
  const navigate = useNavigate();

  const handleStart = (userData) => {
    onStart(userData);
    navigate("/game");
  };

  if (user) {
    return <Navigate to="/game" />;
  }

  return <Login onStart={handleStart} />;
}

function App() {
  const [user, setUser] = useState(null);

  const handleStart = (userData) => {
    setUser(userData);
    console.log("User logged in:", userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route 
            path="/" 
            element={<RegisterPage onStart={handleStart} user={user} />} 
          />
          <Route 
            path="/login" 
            element={<LoginPage onStart={handleStart} user={user} />} 
          />
          <Route 
            path="/game" 
            element={<GamePage user={user} onLogout={handleLogout} />} 
          />
          <Route 
            path="*" 
            element={<Navigate to="/" />} 
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;