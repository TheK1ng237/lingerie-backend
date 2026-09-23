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
                        sizes:true,
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
                        sizes:true,
                        color:true
                    }
                }
            }
        })
        return products
    }

    async findMostOrdered(limit: number): Promise<ProductWithVariants[]> {
        const orderedVariants = await prisma.orderDetails.groupBy({
            by: ["varianteId"],
            where: {
                order: { status: { in: ["paid", "delivered"] } },
            },
            _sum: { quantity: true },
            orderBy: { _sum: { quantity: "desc" } },
        });

        const variantIds = orderedVariants.map((item) => item.varianteId);
        const variants = await prisma.variante.findMany({
            where: { id: { in: variantIds } },
            select: { id: true, productId: true },
        });
        const quantitiesByProduct = new Map<number, number>();
        const variantToProduct = new Map(variants.map((variant) => [variant.id, variant.productId]));

        for (const item of orderedVariants) {
            const productId = variantToProduct.get(item.varianteId);
            if (productId) {
                quantitiesByProduct.set(productId, (quantitiesByProduct.get(productId) || 0) + (item._sum.quantity || 0));
            }
        }

        const products = await prisma.product.findMany({
            where: { id: { in: [...quantitiesByProduct.keys()] } },
            include: {
                brand: true,
                variante: { include: { sizes: true, color: true } },
            },
        });

        return products
            .sort((first, second) => (quantitiesByProduct.get(second.id) || 0) - (quantitiesByProduct.get(first.id) || 0))
            .slice(0, limit);
    }

    async findMostLiked(limit: number): Promise<ProductWithVariants[]> {
        const likedProducts = await prisma.productLike.groupBy({
            by: ["productId"],
            _count: { productId: true },
            orderBy: { _count: { productId: "desc" } },
            take: limit,
        });
        const productIds = likedProducts.map((item) => item.productId);
        if (productIds.length === 0) return [];

        const products = await prisma.product.findMany({
            where: { id: { in: productIds } },
            include: {
                brand: true,
                variante: { include: { sizes: true, color: true } },
            },
        });
        const positionById = new Map(productIds.map((id, index) => [id, index]));
        return products.sort((first, second) => (positionById.get(first.id) || 0) - (positionById.get(second.id) || 0));
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
                        sizes:true,
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