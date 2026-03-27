import {Router} from "express";
import multer from "multer";

import { loginUser, registerUser } from "../controllers/user.controllers.js";

const router = Router();
const upload = multer({ dest: "public/temp" });

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser)

router.route("/login").post(loginUser) 

// secured routes 
router.route("/logout").post(verifyJWT, logoutUser)

export default router;