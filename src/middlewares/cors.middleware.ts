
import env from "../config/env.js";
import cors from "cors"
import { AppError } from "../utils/AppError.js";


const allowOrigines= env.CORS_ORIGIN.split('').map(o=>o.trim()).filter(Boolean)

export const corsMiddleware= cors({
    origin(origin, callback){
        if(!origin || allowOrigines.includes(origin)){

            return callback(null,true)
        }

        return callback(new AppError('origine block by cors'))
    },
    credentials:true,
    methods:['POST','GET','PUT','PATCH','DELETE'],
    allowedHeaders:['content-Type','Authorization']
})