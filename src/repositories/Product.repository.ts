import { Prisma, Product } from "@prisma/client"
import { prisma } from "../config/database.js"
import { IProductRepository, ProductWithVariants } from "./interfaces/iProductRepository.js"


export class ProductRepository implements IProductRepository {

    async create(data:Prisma.ProductCreateInput):Promise<Product>{
        try {
            const product = await prisma.product.create({
                data: data
            })
            return product
        } catch (err: any) {
            if (err?.code === "P2002" && Array.isArray(err?.meta?.target) && err?.meta?.target.includes("id")) {
                await prisma.$executeRawUnsafe(`SELECT setval(pg_get_serial_sequence('"Product"', 'id'), coalesce(max(id), 1)) FROM "Product";`);
                return prisma.product.create({
                    data: data
                });
            }
            throw err;
        }
    }

    async findById(id:number):Promise<ProductWithVariants |null>{
        const product= await prisma.product.findUnique({
            where:{
                id:id
            },
            include:{
                brand: true,
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
                brand: true,
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
                brand: true,
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