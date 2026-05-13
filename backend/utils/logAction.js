import { Log } from "../models/index.js"
export const logAction = async (req, action, message, meta = null) => {
    try {
        await Log.create({
            action,
            message,
            createdBy: req.user?.id || null,
            meta
        })
    } catch (err) {
        console.log("LOG ERROR:", err.message)
    }
}