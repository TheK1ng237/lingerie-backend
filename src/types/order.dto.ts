
export interface OrderResponseDto{
    id:number;
    userId:string;
    totalPrice:number;
    status:string;
    createdAt: Date;
    updatedAt: Date;
}

export interface OrderItemResponseDto{
    id:number;
    orderId:number;
    productId:string;
    quantity:number;
    price:number;
    varianteId:string;
    createdAt: Date;
    updatedAt: Date;
}