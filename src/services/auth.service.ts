import { IUserRepository } from "../repositories/interfaces/IUserRepository.js";
import UserRepository from "../repositories/User.repository.js";
import { AuthTokenDto } from "../types/user.dto.js";
import { AppError } from "../utils/AppError.js";
import { comparePassword } from "../utils/password.js";
import tokenService, { TokenService } from "./token.service.js";


export class AuthService{

    constructor(
        private userRepo:IUserRepository=UserRepository,
        private token:TokenService=tokenService
    ){}

    async login(email:string,password:string):Promise<AuthTokenDto>{

        const user = await this.userRepo.findByEmail(email);

    

        if( !user || !(await comparePassword(password,user.password)) ){
            throw new AppError("incorrect email or password")
        }

        const accessToken = this.token.generateAccessToken({
            sub:user.id,
            role:user.role
        })

        const refreshToken = await this.token.generateRefreshToken(user.id)

        return {accessToken, refreshToken, expireIn:"15m"}
    }

    async refreshToken(oldrefreshToken:string):Promise<AuthTokenDto>{

        const {token: refreshToken , idUser }= 
        await this.token.rotateToken(oldrefreshToken).catch(()=>{
            throw new AppError('sesion expire',401)
        })

        const user = await this.userRepo.findById(idUser)

        if(!user){
            throw new AppError("user not found",401)
        }

        const accessToken = this.token.generateAccessToken({
            sub:user.id,
            role:user.role
        })

        return {accessToken, refreshToken, expireIn:"15m"}

    }

    async logout(refreshToken:string):Promise<void>{

        await this.token.revokeRefreshToken(refreshToken)
    }
}

export default new AuthService();