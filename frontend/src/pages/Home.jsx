import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../api/axios";

export default function Home() {
  const [isOpen, setIsOpen] = useState(true);
  const [videos, setVideos] = useState([]);
  const navigate = useNavigate();

  // 🔥 Fetch videos
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await api.get("/videos");
        setVideos(res.data.data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };

    fetchVideos();
  }, []);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      
      {/* 🟣 Sidebar */}
      <div
        style={{
          width: isOpen ? "220px" : "70px",
          transition: "0.3s",
          background: "#111",
          color: "white",
          padding: "20px"
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>
          🎬 {isOpen && "MyTube"}
        </h2>

        <p style={{ marginBottom: "10px", cursor: "pointer" }}>
          🏠 {isOpen && "Home"}
        </p>

        <p style={{ marginBottom: "10px", cursor: "pointer" }}>
          🔥 {isOpen && "Trending"}
        </p>

        <p style={{ marginBottom: "10px", cursor: "pointer" }}>
          📺 {isOpen && "Subscriptions"}
        </p>

        <p
          style={{ marginTop: "20px", cursor: "pointer" }}
          onClick={() => navigate("/upload")}
        >
          ⬆️ {isOpen && "Upload"}
        </p>
      </div>

      {/* 🟢 Main Content */}
      <div style={{ flex: 1, background: "#f9f9f9", overflowY: "auto" }}>

        {/* 🔵 Navbar */}
        <div
          style={{
            padding: "15px 20px",
            background: "white",
            borderBottom: "1px solid #ddd",
            display: "flex",
            alignItems: "center"
          }}
        >
          {/* Toggle Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            style={{
              marginRight: "15px",
              fontSize: "20px",
              cursor: "pointer",
              background: "none",
              border: "none"
            }}
          >
            ☰
          </button>

          <h3>Home</h3>
        </div>

        {/* 🎥 Video Grid */}
        <div
          style={{
            padding: "20px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "20px"
          }}
        >
          {videos.length === 0 ? (
            <p>No videos found</p>
          ) : (
            videos.map((video) => (
              <div
                key={video._id}
                onClick={() => navigate(`/watch/${video._id}`)} // 🔥 clickable
                style={{
                  background: "white",
                  borderRadius: "10px",
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "0.2s",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
                }}
              >
                {/* Thumbnail */}
                <img
                  src={video.thumbnail}
                  alt="thumbnail"
                  style={{
                    width: "100%",
                    height: "150px",
                    objectFit: "cover"
                  }}
                />

                {/* Info */}
                <div style={{ padding: "10px" }}>
                  <h4 style={{ margin: "5px 0" }}>
                    {video.title}
                  </h4>

                  <p style={{ color: "gray", fontSize: "14px" }}>
                    {video.owner?.fullName}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}