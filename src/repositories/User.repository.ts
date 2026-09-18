import { Prisma, User } from "@prisma/client";
import { prisma }  from "../config/database.js";
import { IUserRepository } from "./interfaces/IUserRepository.js";


export class UserRepository implements IUserRepository {

    async findByEmail(email: string):Promise <User | null> {
       return prisma.user.findUnique({where: {email: email}})
    }

    
    async findById(id: number):Promise<User |null>{

        return prisma.user.findUnique({where:{id}})
    }

    async findAll(): Promise<User[]> {
        return prisma.user.findMany()
    }

    async create(data: Prisma.UserCreateInput): Promise<User> {
        
        return prisma.user.create({data})
    }

    async updateById(id: number,data:Prisma.UserUpdateInput):Promise< User >{

        return prisma.user.update({where:{id},data:{data}})
    }

    async delete(id:  number): Promise<User> {
      return prisma.user.delete({where:{id}})
    }
}


export default new UserRepository()