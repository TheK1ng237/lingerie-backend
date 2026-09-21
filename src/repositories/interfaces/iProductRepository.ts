import { Product,Prisma } from "@prisma/client";

export type ProductWithVariants = Prisma.ProductGetPayload<{
    include: {
        variante: {
            include: {
                sizes: true;
                color: true;
            };
        };
    };
}>;

export interface IProductRepository {
    create(data:Prisma.ProductCreateInput):Promise<Product>;
    findById(id:number):Promise<ProductWithVariants | null>;
    findAll():Promise<ProductWithVariants[]>;
    findByName(name:string):Promise<Product | null>;
    updateById(id:number,data:Prisma.ProductUpdateInput):Promise<ProductWithVariants>;
    delete(id:number):Promise<void>;
}