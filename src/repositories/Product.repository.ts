import { Prisma, Product } from "@prisma/client"
import { prisma } from "../config/database.js"
import { IProductRepository } from "./interfaces/iProductRepository.js"


export class ProductRepository implements IProductRepository {
    async create(data:Prisma.ProductCreateInput):Promise<Product>{
        const product= await prisma.product.create({
            data:data
        })
        return product
    }

    async findById(id:number):Promise<Product |null>{
        const product= await prisma.product.findUnique({
            where:{
                id:id
            }
        })
        return product
    }

    async findAll():Promise<Product[]>{
        const products= await prisma.product.findMany()
        return products
    }

    async updateById(id:number,data:Prisma.ProductUpdateInput):Promise<Product>{
        const product= await prisma.product.update({
            where:{
                id:id
            },
            data:data
        })
        return product
    }

    async delete(id:number):Promise<Product>{
        const product= await prisma.product.delete({
            where:{
                id:id
            }
        })
        return product
    }
}
export default new ProductRepository()