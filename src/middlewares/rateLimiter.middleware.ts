import rateLimit from "express-rate-limit";
import env from "../config/env.js";




export const globalLimiter = rateLimit({
    windowMs:env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX,
    standardHeaders:true,
    legacyHeaders:false,
    skip: (req) => req.path.startsWith("/api/v1/auth"),
    message:{success:false, message:'too many attempts. please try again later'}

})

export const authLimiter = rateLimit({
    windowMs: env.AUTH_RATE_LIMIT_WINDOW_MS,
    max: env.AUTH_RATE_LIMIT_MAX,
    standardHeaders:true,
    legacyHeaders:false,
    skipSuccessfulRequests:true,
    message:{success:false, message:'Trop de tentatives de connexion. Réessayez dans quelques minutes.'}
})