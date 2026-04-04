import { useState } from "react";
import { api } from "../api/axios";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("email", email);
    formData.append("username", username);
    formData.append("password", password);
    formData.append("avatar", avatar);

    try {
      const res = await api.post("/register", formData);
      alert("Register Successful ✅");
      console.log(res.data);
    } catch (error) {
      console.log(error.response);
      alert(error.response?.data?.message || "Register Failed");
    }
  };

  return (
    <div>
      <h2>Register</h2>

      <form onSubmit={handleRegister}>
        <input placeholder="Full Name" onChange={(e) => setFullName(e.target.value)} />
        <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <input placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />

        <input type="file" onChange={(e) => setAvatar(e.target.files[0])} />

        <button type="submit">Register</button>
      </form>
    </div>
  );
}