import { Role } from "@prisma/client";


export interface UserResponceDto{
    id:string;
    email:string;
    firstName:string;
    lastname:string;
    role:Role;
    adresse:string;
    phone:number;
    createdAt: Date;
}