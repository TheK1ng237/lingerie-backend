import { Type } from "@prisma/client";

export interface varianteResponseDto {
    id: number;
    stock: number;
    price: number;
    image: string;
    size: {
        id: number;
        label: string;
    };
    color: {
        id: number;
        code: string;
    };
}

export interface productResponseDto{
    id:number;
    name:string;
    description:string;
    price:number;
    image:string;
    createdAt:Date;
    type: Type;
    variante: varianteResponseDto[];

}