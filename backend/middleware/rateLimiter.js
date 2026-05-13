import rateLimit from "express-rate-limit"

export const requestLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // max 5 requests per IP
  message: {
    error: "Too many requests. Try again later."
  }
})