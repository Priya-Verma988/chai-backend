import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { api } from "../api/axios";

export default function Profile() {
  const { user, setUser } = useContext(AuthContext);

  const [edit, setEdit] = useState(false);
  const [fullName, setFullName] = useState(user?.fullName);
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(user?.avatar);

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("fullName", fullName);
      if (avatar) formData.append("avatar", avatar);

      const res = await api.patch("/update-profile", formData);

      setUser(res.data.data); // 🔥 update UI instantly
      setEdit(false);

      alert("Profile Updated ✅");
    } catch (error) {
      console.error(error);
      alert("Update Failed ❌");
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ textAlign: "center", maxWidth: "400px" }}>

        {/* 👤 Avatar */}
        <img
          src={preview}
          alt="avatar"
          style={{
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            objectFit: "cover",
            marginBottom: "15px"
          }}
        />

        {/* ✏️ EDIT MODE */}
        {edit ? (
          <form onSubmit={handleUpdate}>
            <input
              className="input"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />

            <input
              type="file"
              className="input"
              onChange={(e) => {
                const file = e.target.files[0];
                setAvatar(file);
                setPreview(URL.createObjectURL(file)); // 🔥 live preview
              }}
            />

            <button className="button">Save</button>
          </form>
        ) : (
          <>
            {/* 👤 Info */}
            <h2>{user?.fullName}</h2>
            <p style={{ color: "#555" }}>{user?.email}</p>

            <div
              style={{
                background: "#f1f5f9",
                padding: "15px",
                borderRadius: "10px",
                margin: "15px 0"
              }}
            >
              <p><strong>Username:</strong> {user?.username}</p>
            </div>

            <button className="button" onClick={() => setEdit(true)}>
              Edit Profile
            </button>
          </>
        )}
      </div>
    </div>
  );
}
