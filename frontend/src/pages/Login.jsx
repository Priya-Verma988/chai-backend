import { useState, useContext } from "react";
import { api } from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/login", {
        email,
        password
      });

      setUser(res.data.data);
      alert("Login Successful ");

      navigate("/dashboard");

    } catch (error) {
      console.error(error);
      alert("Login Failed ");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2 className="title">Login</h2>

        <form onSubmit={handleLogin}>
          <input
            className="input"
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="input"
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="button">Login</button>
        </form>
      </div>
    </div>
  );
}

