
import { Status } from "@prisma/client";

export interface OrderResponseDto{
    id:number;
    status:Status;
    totalPrice:number;
    dateOrder: Date;
    idUser:number;
    
    orderDetails:OrderItemResponseDto[];
}

export interface OrderItemResponseDto{
    id:number;
    orderId:number;
    quantity:number;
    price:number;
    varianteId:number;
}