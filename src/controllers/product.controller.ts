import { Prisma } from "@prisma/client";
import { Request, Response } from "express";
import productService from "../services/product.service.js";

export async function getProducts(_req: Request, res: Response): Promise<void> {
    res.json({ status: true, data: await productService.getAllProduct() });
}

export async function getProduct(req: Request, res: Response): Promise<void> {
    res.json({ status: true, data: await productService.getProductById(Number(req.params.id)) });
}

export async function createProduct(req: Request, res: Response): Promise<void> {
    const { brandId, ...product } = req.body;
    const data: Prisma.ProductCreateInput = {
        ...product,
        brand: { connect: { id: Number(brandId) } },
    };
    res.status(201).json({ status: true, data: await productService.createProduct(data) });
}

export async function updateProduct(req: Request, res: Response): Promise<void> {
    const { brandId, ...product } = req.body;
    const data: Prisma.ProductUpdateInput = brandId === undefined
        ? product
        : { ...product, brand: { connect: { id: Number(brandId) } } };
    res.json({ status: true, data: await productService.updateById(Number(req.params.id), data) });
}

export async function deleteProduct(req: Request, res: Response): Promise<void> {
    await productService.deletProduct(Number(req.params.id));
    res.status(204).send();
}

export async function createVariant(req: Request, res: Response): Promise<void> {
    const { stock, price, image, idSize, idColor } = req.body;
    const data: Omit<Prisma.VarianteUncheckedCreateInput, "productId"> = {
        stock: Number(stock),
        price: Number(price),
        image,
        idSize: Number(idSize),
        idColor: Number(idColor),
    };
    res.status(201).json({ status: true, data: await productService.createVariant(Number(req.params.productId), data) });
}

export async function getVariant(req: Request, res: Response): Promise<void> {
    res.json({ status: true, data: await productService.getVariantById(Number(req.params.id)) });
}

export async function updateVariant(req: Request, res: Response): Promise<void> {
    res.json({ status: true, data: await productService.updateVariantById(Number(req.params.id), req.body) });
}

export async function deleteVariant(req: Request, res: Response): Promise<void> {
    await productService.deleVariante(Number(req.params.id));
    res.status(204).send();
}