import { User } from "../models/index.js"

export const uploadProfilePhoto = async (req, res) => {

    try {

        const user = await User.findByPk(req.user.id)

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        user.profilePhoto = req.file.filename

        await user.save()

        res.json({
            message: "Photo uploaded",
            photo: req.file.filename
        })

    } catch (err) {

        res.status(500).json({
            error: err.message
        })

    }

}