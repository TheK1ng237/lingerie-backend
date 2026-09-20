import { Prisma } from "@prisma/client";
import { Request, Response } from "express";
import productService from "../services/product.service.js";
import { prisma } from "../config/database.js";

async function getOrCreateColorId(colorInput?: string | number): Promise<number> {
    if (typeof colorInput === "number" && colorInput > 0) return colorInput;
    const colorStr = (colorInput ? String(colorInput) : "Noir").trim();

    const existing = await prisma.color.findFirst({
        where: { code: { equals: colorStr, mode: "insensitive" } },
    });
    if (existing) return existing.id;

    const created = await prisma.color.create({
        data: { code: colorStr },
    });
    return created.id;
}

async function getOrCreateSizeId(sizeInput?: string | number): Promise<number> {
    if (typeof sizeInput === "number" && sizeInput > 0) return sizeInput;
    const sizeStr = (sizeInput ? String(sizeInput) : "M").trim();

    const existing = await prisma.size.findFirst({
        where: { label: { equals: sizeStr, mode: "insensitive" } },
    });
    if (existing) return existing.id;

    const created = await prisma.size.create({
        data: { label: sizeStr },
    });
    return created.id;
}

export async function getProducts(_req: Request, res: Response): Promise<void> {
    res.json({ status: true, data: await productService.getAllProduct() });
}

export async function getProduct(req: Request, res: Response): Promise<void> {
    res.json({ status: true, data: await productService.getProductById(Number(req.params.id)) });
}

export async function createProduct(req: Request, res: Response): Promise<void> {
    const { brandId = 1, ...product } = req.body;
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
    const { stock, price, image, idSize, idColor, color, size } = req.body;

    const finalColorId = idColor ? Number(idColor) : await getOrCreateColorId(color);
    const finalSizeId = idSize ? Number(idSize) : await getOrCreateSizeId(size);

    const data: Omit<Prisma.VarianteUncheckedCreateInput, "productId"> = {
        stock: Number(stock) || 0,
        price: Number(price) || 0,
        image: image || "/femme/image21.jpg",
        idSize: finalSizeId,
        idColor: finalColorId,
    };
    res.status(201).json({ status: true, data: await productService.createVariant(Number(req.params.productId), data) });
}

export async function getVariant(req: Request, res: Response): Promise<void> {
    res.json({ status: true, data: await productService.getVariantById(Number(req.params.id)) });
}

export async function updateVariant(req: Request, res: Response): Promise<void> {
    const { stock, price, image, idSize, idColor, color, size } = req.body;
    const payload: any = {};
    if (stock !== undefined) payload.stock = Number(stock);
    if (price !== undefined) payload.price = Number(price);
    if (image !== undefined) payload.image = image;

    if (idColor || color) {
        payload.idColor = idColor ? Number(idColor) : await getOrCreateColorId(color);
    }
    if (idSize || size) {
        payload.idSize = idSize ? Number(idSize) : await getOrCreateSizeId(size);
    }

    res.json({ status: true, data: await productService.updateVariantById(Number(req.params.id), payload) });
}

export async function deleteVariant(req: Request, res: Response): Promise<void> {
    await productService.deleVariante(Number(req.params.id));
    res.status(204).send();
}