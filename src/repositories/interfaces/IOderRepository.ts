import { Order,Prisma } from "@prisma/client";

export interface IOrderRepository {
    create(data:Prisma.OrderCreateInput):Promise<Order>;
    findById(id:string):Promise<Order |null>;
    findAll():Promise<Order[]>;
    delete(id:string):Promise<void>;
}