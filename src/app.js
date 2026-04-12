import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import videoRoutes from "./routes/video.routes.js";
const app = express();
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}) 
);

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())
app.use("/videos", videoRoutes);

// routes import

import userRouter from "./routes/user.routes.js"

// routes declaration
app.use("/users", userRouter)

//http://localhost:8000/api/v1/users/register

export  { app };