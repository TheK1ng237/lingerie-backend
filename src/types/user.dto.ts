import { Role } from "@prisma/client";


export interface UserResponceDto{
    id:number;
    email:string;
    firstName:string;
    lastname:string;
    role:Role;
    adresse:string;
    phone:number;
    createdAt: Date;
}