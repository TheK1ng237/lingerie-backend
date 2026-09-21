import { Prisma } from "@prisma/client";
import { IProductRepository } from "../repositories/interfaces/iProductRepository.js";
import productRepository from "../repositories/Product.repository.js";
import { productResponseDto } from "../types/product.dto.js";
import { AppError } from "../utils/AppError.js";
import varianteRepository from "../repositories/Variante.repository.js";
import { IVarianteRepository, VarianteWithRelations } from "../repositories/interfaces/IVarianteRepository.js";
import { error } from "console";

export class ProductService{

    constructor (
        private productRepo: IProductRepository = productRepository,
        private varianteRepo: IVarianteRepository = varianteRepository
    ){}

    async createProduct(data:Prisma.ProductCreateInput):Promise<productResponseDto>{

        const existingProductnmae = await this.productRepo.findByName(data.name)

        if(existingProductnmae){

            throw new AppError("a product with this name allready exist",409)
        }

        const product = await this.productRepo.create(data)

        return { ...product, variante: [] }

    }

    async getProductById(id:number):Promise<productResponseDto >{

        const existingProduct= await this.productRepo.findById(id)

        if(!existingProduct){
            throw new AppError("the product was not found",404)
        }

        return existingProduct
    }

    async getAllProduct():Promise<productResponseDto[]>{

        const products = await this.productRepo.findAll();

        return products
    }

    async updateById(id:number,data:Prisma.ProductUpdateInput):Promise<productResponseDto>{

        const product = await this.productRepo.findById(id)

        if(!product){
            throw new AppError("sorry this product does not exist",404)
        }

        const updateProduct= await this.productRepo.updateById(id,data);

        return updateProduct
    }

    async deletProduct(id:number):Promise<void>{
        const product = await this.productRepo.findById(id)

        if(!product){
            throw new AppError("sorry by the product does not exist",404)
        }

        await this.productRepo.delete(id)
    }

    async createVariant(
        productId: number,
        data: Prisma.VarianteCreateInput
    ): Promise<VarianteWithRelations> {
        const product = await this.productRepo.findById(productId);

        if (!product) {
            throw new AppError("sorry this product does not exist", 404);
        }

        return this.varianteRepo.create(data);
    }

    async getVariantById(id: number): Promise<VarianteWithRelations> {
        const variante = await this.varianteRepo.findById(id);

        if (!variante) {
            throw new AppError("the variant was not found", 404);
        }

        return variante;
    }

    async updateVariantById(
        id: number,
        data: Prisma.VarianteUpdateInput
    ): Promise<VarianteWithRelations> {
        await this.getVariantById(id);

        return this.varianteRepo.updateById(id, data);
    }

    
    async deleVariante(id:number):Promise<void>{
        const variante = await this.varianteRepo.findById(id)

        if(!variante){
            throw new AppError("sorry but this product does not existe")
        }

        await this.varianteRepo.deleteVariante(id)
    }

}

export default new ProductService();