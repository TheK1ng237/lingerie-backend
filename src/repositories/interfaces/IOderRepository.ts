import { Order,Prisma } from "@prisma/client";

export type OrderWithDetails = Prisma.OrderGetPayload<{
    include: {
        user: true;
        orderDetails: {
            include: {
                variante: {
                    include: { product: true };
                };
            };
        };
    };
}>;

export interface IOrderRepository {
    create(data:Prisma.OrderCreateInput):Promise<OrderWithDetails>;
    findById(id:number):Promise<OrderWithDetails |null>;
    findByUserId(idUser:number):Promise<OrderWithDetails[]>;
    findAll():Promise<OrderWithDetails[]>;
    updateById(id:number,data:Prisma.OrderUpdateInput):Promise<OrderWithDetails>;
    delete(id:number):Promise<void>;
}