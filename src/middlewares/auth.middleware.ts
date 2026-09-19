import { NextFunction ,Request,Response} from "express";
import { AppError } from "../utils/AppError.js";
import tokenService, { TokenService } from "../services/token.service.js";


declare global{
    namespace Express{
interface Request{
    user?:{id:number,role:string}
}
    }
}

export function protect(req:Request,res:Response, next:NextFunction):void{

    const header=req.headers.authorization

    if(!header?.startsWith('Bearer')){
        throw new AppError('Authentication require',401)
    }

    try{
        const token= header.split('')[1];

        const payload = tokenService.verifyAccessToken(token)

        req.user={id:payload.sub, role:payload.role}
        next();
    }catch{
        throw new AppError('invalid or expired token',401)
    }


}

export function authorize(...roles:string[]){
    return (req:Request,res:Response,next:NextFunction):void =>{

        if(!req.user || !roles.includes(req.user.role)){

            return next( new AppError("this role is not authorize",403))
        }

        next()
    };
}