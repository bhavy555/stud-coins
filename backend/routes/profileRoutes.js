import express from "express"

import { auth } from "../middleware/auth.js"

import upload from "../middleware/upload.js"

import { uploadProfilePhoto, getProfile
} from "../controllers/profileController.js"

const router = express.Router()

router.post(
    "/upload-photo",
    auth,
    upload.single("photo"),
    uploadProfilePhoto
)

router.get(
    "/",
    auth,
    getProfile
)

export default router