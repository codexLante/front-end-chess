import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/login.css";
import chessImage from "../assets/wp.png";
import axios from "axios";

function Register({ onRegister }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = () => {
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    axios({
      method: "POST",
      url: "http://127.0.0.1:5000/user/add",
      data: { name, email, password },
    })
      .then((res) => {
        const user = res.data.member;
        setSuccessMessage("Umesajiliwa kikamilifu!");
        setName("");
        setEmail("");
        setPassword("");
        onRegister(user);
        navigate("/game");
      })
      .catch((e) => {
        console.log("Registration error:", e);
        setErrorMessage(
          typeof e?.response?.data?.error === "string"
            ? e.response.data.error
            : "Usajili umeshindikana. Tafadhali jaribu tena."
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const goToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <img src={chessImage} alt="Chess" />
        <div className="login-title">Sajili Akaunti Mpya</div>

        {isLoading && <p className="info">Inapakia...</p>}
        {errorMessage && <p className="error">{errorMessage}</p>}
        {successMessage && <p className="success">{successMessage}</p>}

        <label className="login-label" htmlFor="name">Jina</label>
        <input
          id="name"
          className="login-input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Andika jina lako"
        />

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

        <button className="login-button" onClick={handleRegister}>
          SAJILI
        </button>

        <div className="toggle-mode">
          <span onClick={goToLogin} className="toggle-link">
            Una akaunti tayari? Ingia hapa
          </span>
        </div>
      </div>
    </div>
  );
}

export default Register;
