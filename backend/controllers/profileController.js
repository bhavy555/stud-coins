import { User } from "../models/index.js"

import fs from "fs"

import path from "path"

export const uploadProfilePhoto = async (req, res) => {

    try {

        if (!req.file) {
            return res.status(400).json({
                message: "No image uploaded"
            })
        }

        const user = await User.findByPk(req.user.id)

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }

            if (user.profilePhoto) {

            const oldPath = path.join(
                "uploads",
                "profiles",
                user.profilePhoto
            )

            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath)
            }
        }

        user.profilePhoto = req.file.filename

        await user.save()

        res.json({
            message: "Photo uploaded",
            photo: req.file.filename,
            photoUrl:
                `${req.protocol}://${req.get("host")}/uploads/profiles/${req.file.filename}`
        })

    } catch (err) {

        console.log(err)

        res.status(500).json({
            error: err.message
        })

    }

}

export const getProfile = async (req, res) => {

    try {

        const user = await User.findByPk(req.user.id, {
            attributes: [
                "id",
                "username",
                "role",
                "shopName",
                "profilePhoto"
            ]
        })

        res.json({
            id: user.id,
            username: user.username,
            role: user.role,
            profilePhoto: user.profilePhoto
        })

    } catch (err) {

        res.status(500).json({
            error: err.message
        })

    }

}