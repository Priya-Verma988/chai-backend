import { useState } from "react";
import { api } from "../api/axios";

export default function UploadVideo() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("videoFile", videoFile);
      formData.append("thumbnail", thumbnail);

      // 🔥 FIXED URL
      await api.post("/videos/upload", formData, {
        withCredentials: true
      });

      alert("Uploaded ✅");

      // optional reset
      setTitle("");
      setDescription("");
      setVideoFile(null);
      setThumbnail(null);

    } catch (error) {
      console.error(error);
      alert("Upload failed ❌");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Upload Video</h2>

        <form onSubmit={handleUpload}>
          <input
            className="input"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            className="input"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <input
            type="file"
            onChange={(e) => setVideoFile(e.target.files[0])}
          />

          <input
            type="file"
            onChange={(e) => setThumbnail(e.target.files[0])}
          />

          <button className="button">Upload</button>
        </form>
      </div>
    </div>
  );
}