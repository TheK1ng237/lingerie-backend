import { Prisma, Product } from "@prisma/client"
import { prisma } from "../config/database.js"
import { IProductRepository, ProductWithVariants } from "./interfaces/iProductRepository.js"


export class ProductRepository implements IProductRepository {

    async create(data:Prisma.ProductCreateInput):Promise<Product>{
        const product= await prisma.product.create({
            data:data
        })
        return product
    }

    async findById(id:number):Promise<ProductWithVariants |null>{
        const product= await prisma.product.findUnique({
            where:{
                id:id
            },
            include:{
                variante:{
                    include:{
                        size:true,
                        color:true
                    }
                }
            }
        })
        return product
    }

    async findByName(name: string): Promise<Product |null> {
        const product = await prisma.product.findFirst({
            where:{name}
        })

        return product
    }

    async findAll():Promise<ProductWithVariants[]>{
        const products= await prisma.product.findMany({
            include:{
                variante:{
                    include:{
                        size:true,
                        color:true
                    }
                }
            }
        })
        return products
    }

    async updateById(id:number,data:Prisma.ProductUpdateInput):Promise<ProductWithVariants>{
        const product= await prisma.product.update({
            where:{
                id:id
            },
            data:data,
            include:{
                variante:{
                    include:{
                        size:true,
                        color:true
                    }
                }
            }
        })
        return product
    }

    async delete(id:number):Promise<void>{
        await prisma.product.delete({
            where:{
                id:id
            }
        })
    }
}
export default new ProductRepository()