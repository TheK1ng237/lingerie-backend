import { Role } from "@prisma/client";


export interface UserResponceDto{
    id:number;
    email:string;
    firstName:string;
    lastName:string;
    role:Role;
    adresse:string;
    phone:number;
    createdAt: Date;
}