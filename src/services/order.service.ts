import { Prisma } from "@prisma/client";
import { IOrderRepository } from "../repositories/interfaces/IOderRepository.js";
import OrderRepository from "../repositories/Order.repository.js";
import { OrderItemResponseDto, OrderResponseDto } from "../types/order.dto.js";
import { AppError } from "../utils/AppError.js";


export class OrderService {

    constructor (
        private orderRepo:IOrderRepository = OrderRepository
    ){}

    async getAllOrder():Promise<OrderResponseDto[]>{

        const oders = await this.orderRepo.findAll()

        return oders
    }

    async getUserOrder(idUser:number):Promise<OrderResponseDto[]>{
        return this.orderRepo.findByUserId(idUser)
    }

    async getOrderById(id:number):Promise<OrderResponseDto>{
        const order= await this.orderRepo.findById(id)

        if(!order){
            throw new AppError("sorry no oder found ",404)
        }

        return order
    }

    async createOrder(data:Prisma.OrderCreateInput):Promise<OrderResponseDto>{

        const order = await this.orderRepo.create(data)

        return order
    }

    async updateOrderById(id:number,data:Prisma.OrderUpdateInput):Promise<OrderResponseDto>{

        const existingOrder = await this.orderRepo.findById(id)

        if(!existingOrder){
            throw new AppError("order not found")
        }
        const order= await this.orderRepo.updateById(id,data)

        return order
    }
    
    async deletOrder(id:number):Promise<void>{
        const order= await this.orderRepo.findById(id)

        if(!order){
            throw new AppError("order not found",404)
        }

        await this.orderRepo.delete(id)
    }

}

export default new OrderService();