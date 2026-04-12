import { Vedio } from "../models/vedio.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const uploadVedio = async (req, res) => {
  try {
    const { title, description } = req.body;

    const videoPath = req.files?.videoFile?.[0]?.path;
    const thumbnailPath = req.files?.thumbnail?.[0]?.path;

    if (!videoPath || !thumbnailPath) {
      return res.status(400).json({ message: "Files missing" });
    }

    const uploadedVideo = await uploadOnCloudinary(videoPath);
    const uploadedThumbnail = await uploadOnCloudinary(thumbnailPath);

    const vedio = await Vedio.create({
      vedioFile: uploadedVideo.url,
      thumbnail: uploadedThumbnail.url,
      title,
      description,
      duration: 0,
      owner: req.user._id
    });

    res.status(200).json({
      success: true,
      data: vedio
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Upload failed" });
  }
};

export const getAllVedios = async (req, res) => {
  try {
    const vedios = await Vedio.find()
      .populate("owner", "fullName avatar")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: vedios
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Fetch failed" });
  }
};