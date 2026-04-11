import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { api } from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await api.post("/logout");
    setUser(null);
    navigate("/");
  };

  return (
    <div className="container">
      <div className="card" style={{ textAlign: "center" }}>

        {/* 👤 Avatar */}
        <img
          src={user?.avatar}
          alt="avatar"
          style={{
            width: "90px",
            height: "90px",
            borderRadius: "50%",
            marginBottom: "15px",
            objectFit: "cover",
          }}
        />

        {/* 👋 Welcome */}
        <h1 style={{ marginBottom: "10px" }}>Dashboard</h1>
        <h2 style={{ marginBottom: "5px" }}>
          Welcome, {user?.fullName}
        </h2>

        {/* 📧 Email */}
        <p style={{ color: "#555", marginBottom: "20px" }}>
          {user?.email}
        </p>

        {/* 📦 Info Box */}
        <div
          style={{
            background: "#f1f5f9",
            padding: "15px",
            borderRadius: "10px",
            marginBottom: "20px",
          }}
        >
          <p><strong>Username:</strong> {user?.username}</p>
        </div>

       { /* 🚪 Logout */}
        <button
          className="button"
          onClick={handleLogout}
          style={{ background: "#ef4444" }}
        >
          Logout
        </button>
        <button onClick={() => navigate("/profile")} className="button">
        Go to Profile
      </button>
      </div>
    </div>
  );
}