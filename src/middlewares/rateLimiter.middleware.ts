import rateLimit from "express-rate-limit";
import env from "../config/env.js";




export const globalLimiter = rateLimit({
    windowMs:env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX,
    standardHeaders:true,
    legacyHeaders:false,
    message:{success:false, message:'too many attempts. please try again later'}

})

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max:10,
    standardHeaders:true,
    legacyHeaders:false,
    skipSuccessfulRequests:true,
    message:{success:false, message:'too many attempts. please try again in 15 minute'}
})