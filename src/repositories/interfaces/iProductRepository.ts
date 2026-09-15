import { Product,Prisma } from "@prisma/client";


export interface IProductRepository {
    create(data:Prisma.ProductCreateInput):Promise<Product>;
    findById(id:string):Promise<Product |null>;
    findAll():Promise<Product[]>;
    delete(id:string):Promise<void>;
}