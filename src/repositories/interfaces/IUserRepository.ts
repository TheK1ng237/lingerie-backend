import { User,Prisma } from "@prisma/client";

export interface IUserRepository {

    create(data:Prisma.UserCreateInput):Promise<User>;
    findByEmail(email:string):Promise<User | null>;
    findById(id:string):Promise<User | null>;
    findAll():Promise<User[]>;
    delete(id:string):Promise<void>;
}