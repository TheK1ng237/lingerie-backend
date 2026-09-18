import { Prisma, User } from "@prisma/client";
import userRepository from "../repositories/User.repository.js";
import { IUserRepository } from "../repositories/interfaces/IUserRepository.js";
import { AppError } from "../utils/AppError.js";
import { UserResponceDto } from "../types/user.dto.js";


export class UserService {

    constructor(private userRepo: IUserRepository = userRepository ) {}

    async registerUser(data:Prisma.UserCreateInput): Promise<UserResponceDto> {

        const existingUser = await this.userRepo.findByEmail(data.email);
        if (existingUser) {
            throw new AppError("User with this email already exists.",409);
        }

        const newUser = await this.userRepo.create(data);
        const {password,...userDTO} = newUser;
        return userDTO;
    }

    async getUserById(id:number):Promise<UserResponceDto>{

        const user =await this.userRepo.findById(id);
        if(!user){
            throw new AppError("User not found",404);
        }
        const {password,...userDTO} = user;
        return userDTO;
    }

    async getAllUsers():Promise<UserResponceDto[]>{

        const users = await this.userRepo.findAll();

        return users.map((user: User) => {
            const {password,...userDTO} = user;
            return userDTO;
        });
    }

    async updateUser(id:number,data:Prisma.UserUpdateInput):Promise<UserResponceDto>{

        const user = await this.userRepo.findById(id);
        if(!user){
            throw new AppError("User not found",404);
        }

        const updatedUser = await this.userRepo.updateById(id,data);
        const {password,...userDTO} = updatedUser;
        return userDTO;
    }

    async deleteUser(id:number):Promise<UserResponceDto>{

        const user = await this.userRepo.findById(id);
        if(!user){
            throw new AppError("User not found",404);
        }

        const deletedUser = await this.userRepo.delete(id);
        const {password,...userDTO} = deletedUser;
        return userDTO;
    }
}

export default new UserService();