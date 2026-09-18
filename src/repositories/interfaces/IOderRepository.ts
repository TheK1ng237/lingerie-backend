import { Order,Prisma } from "@prisma/client";

export interface IOrderRepository {
    create(data:Prisma.OrderCreateInput):Promise<Order>;
    findById(id:number):Promise<Order |null>;
    findAll():Promise<Order[]>;
    updateById(id:number,data:Prisma.OrderUpdateInput):Promise<Order>;
    delete(id:number):Promise<void>;
}