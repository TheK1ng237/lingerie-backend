
import env from "../config/env.js";
import cors from "cors"
import { AppError } from "../utils/AppError.js";


const allowOrigines = env.CORS_ORIGIN ? env.CORS_ORIGIN.split(',').map(o => o.trim()).filter(Boolean) : ["http://localhost:3000", "http://localhost:3001"];

export const corsMiddleware = cors({
    origin(origin, callback) {
        if (!origin || allowOrigines.length === 0 || allowOrigines.includes(origin)) {
            return callback(null, true);
        }
        return callback(new AppError('origine block by cors'));
    },
    credentials: true,
    methods: ['POST', 'GET', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'content-type', 'authorization']
});