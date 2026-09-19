import { Request,Response,NextFunction } from "express";
import { AppError } from "../utils/AppError.js";
import logger from "../config/logger.js";
import env from "../config/env.js";


export const errorHandler =(
    error:Error,
    req:Request,
    res:Response,
    next:NextFunction,
):void =>{

    const statusCode = error instanceof AppError ? error.statuscode : 500;

    const message = error instanceof AppError ? error.message : (statusCode === 500 ? "internal server error" : error.message);

    if(statusCode==500){
        logger.error({error},'Error not generated')
    }

    res.status(statusCode).json({
        status:false,
        message,
        stack: env.NODE_ENV === "development" ? error.stack : undefined
    })
}

