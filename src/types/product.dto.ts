import { Type } from "@prisma/client";

export interface varianteResponseDto {
    id: string;
    stock: number;
    price: number;
    image: string;
    size: {
        id: string;
        label: string;
    };
    color: {
        id: string;
        code: string;
    };
}

export interface productResponceDto{
    id:string;
    name:string;
    description:string;
    price:number;
    image:string;
    createdAt: Date;
    type: Type;
    variante: varianteResponseDto[];

}