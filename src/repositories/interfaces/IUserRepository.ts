import { User,Prisma } from "@prisma/client";

export interface IUserRepository {

    create(data:Prisma.UserCreateInput):Promise<User>;
    findByEmail(email:string):Promise<User | null>;
    findById(id: number):Promise<User | null>;
    updateById(id: number,data:Prisma.UserUpdateInput):Promise<User >;
    findAll():Promise<User[]>;
    delete(id: number):Promise<User>;
}