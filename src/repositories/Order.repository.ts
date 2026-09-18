import { Prisma, Order } from "@prisma/client"
import { prisma } from "../config/database.js"
import { IOrderRepository } from "./interfaces/IOderRepository.js"


export class OrderRepository implements IOrderRepository {
    async create(data:Prisma.OrderCreateInput):Promise<Order>{
        const order= await prisma.order.create({
            data:data
        })
        return order
    }

    async findById(id:number):Promise<Order |null>{
        const order= await prisma.order.findUnique({
            where:{
                id:id
            }
        })
        return order
    }

    async findAll():Promise<Order[]>{
        const orders= await prisma.order.findMany()
        return orders
    }

    async updateById(id:number,data:Prisma.OrderUpdateInput):Promise<Order>{
        const order= await prisma.order.update({
            where:{
                id:id
            },
            data:data
        })
        return order
    }

    async delete(id:number):Promise<void>{
        await prisma.order.delete({
            where:{
                id:id
            }
        })
    }
}
export default new OrderRepository()