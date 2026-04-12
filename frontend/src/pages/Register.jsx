import { useState } from "react";
import { api } from "../api/axios";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("email", email);
    formData.append("username", username);
    formData.append("password", password);
    formData.append("avatar", avatar);

    try {
      setLoading(true);

      const res = await api.post("/users/register", formData);

      alert("Register Successful ✅");
      console.log(res.data);

    } catch (error) {
      console.log(error.response);
      alert(error.response?.data?.message || "Register Failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2 className="title">Create Account</h2>

        <form onSubmit={handleRegister}>
          <input
            className="input"
            placeholder="Full Name"
            onChange={(e) => setFullName(e.target.value)}
          />

          <input
            className="input"
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="input"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            className="input"
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            className="input"
            type="file"
            onChange={(e) => setAvatar(e.target.files[0])}
          />

          <button className="button" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}