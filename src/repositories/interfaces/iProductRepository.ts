import { Product,Prisma } from "@prisma/client";


export interface IProductRepository {
    create(data:Prisma.ProductCreateInput):Promise<Product>;
    findById(id:number):Promise<Product |null>;
    findAll():Promise<Product[]>;
    updateById(id:number,data:Prisma.ProductUpdateInput):Promise<Product>;
    delete(id:number):Promise<Product>;
}