import { Prisma, Order } from "@prisma/client"
import { prisma } from "../config/database.js"
import { IOrderRepository, OrderWithDetails } from "./interfaces/IOderRepository.js"


export class OrderRepository implements IOrderRepository {

    async create(data:Prisma.OrderCreateInput):Promise<OrderWithDetails>{
        const order= await prisma.order.create({
            data:data,
            include:{
                orderDetails:true
            }
        })
        return order
    }

    async findById(id:number):Promise<OrderWithDetails |null>{
        const order= await prisma.order.findUnique({
            where:{id},
            include:{
                orderDetails:true
            }
        })
        return order
    }
    async findByUserId(idUser: number): Promise<OrderWithDetails[]> {
        const orders = await prisma.order.findMany({
            where:{ idUser },
            include:{
                orderDetails:true
            }
        })

        return orders
    }
    
    async findAll():Promise<OrderWithDetails[]>{
        const orders= await prisma.order.findMany({
            include:{
                orderDetails:true
            }
        })
        return orders
    }

    async updateById(id:number,data:Prisma.OrderUpdateInput):Promise<OrderWithDetails>{
        const order= await prisma.order.update({
            where:{
                id:id
            },
            data:data,
            include:{
                orderDetails:true
            }
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