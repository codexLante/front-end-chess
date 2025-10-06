import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/login.css";
import chessImage from "../assets/wp.png";
import axios from "axios";

function Login({ onStart }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

const handleLogin = () => {
  setIsLoading(true);
  setErrorMessage("");
  setSuccessMessage("");

  axios({
    method: "POST",
    url: "http://127.0.0.1:5000/user/login",
    data: { email, password },
  })
    .then((res) => {
      const userData = res.data.user; 
      
      if (res.data.token) {
        localStorage.setItem('access_token', res.data.token);
      }  
      
      setSuccessMessage("Umeingia kikamilifu!");
      onStart(userData);  
      navigate("/game");
    })
    .catch((e) => {
      console.log("Login error:", e);
      setErrorMessage(
        typeof e?.response?.data?.error === "string"
          ? e.response.data.error
          : "Imeshindikana kuingia. Tafadhali jaribu tena."
      );
    })
    .finally(() => {
      setIsLoading(false);
    });
};

  const goToRegister = () => {
    navigate("/register");
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <img src={chessImage} alt="Chess" />
        <div className="login-title">Mchezo wa Sataranji</div>

        {isLoading && <p className="info">Inapakia...</p>}
        {errorMessage && <p className="error">{errorMessage}</p>}
        {successMessage && <p className="success">{successMessage}</p>}

        <label className="login-label" htmlFor="email">Barua Pepe</label>
        <input
          id="email"
          className="login-input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Andika barua pepe yako"
        />

        <label className="login-label" htmlFor="password">Nywila</label>
        <input
          id="password"
          className="login-input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Andika nywila yako"
        />

        <button className="login-button" onClick={handleLogin}>
          INGIA
        </button>

        <div className="toggle-mode">
          <span onClick={goToRegister} className="toggle-link">
            Huna akaunti? Sajili hapa
          </span>
        </div>
      </div>
    </div>
  );
}

export default Login;