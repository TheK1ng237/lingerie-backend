import { z } from "zod";
import { Category, Type } from "@prisma/client";

const productFields = {
    name: z.string().min(1),
    description: z.string().min(1),
    price: z.coerce.number().nonnegative(),
    image: z.string().min(1).optional(),
    category: z.nativeEnum(Category),
    type: z.nativeEnum(Type),
};

export const createProductSchema = z.object({
    body: z.object({ ...productFields, brandId: z.coerce.number().int().positive().optional().default(1) }),
});

export const updateProductSchema = z.object({
    params: z.object({ id: z.coerce.number().int().positive() }),
    body: z.object({ ...productFields, brandId: z.coerce.number().int().positive() }).partial(),
});

export const createVariantSchema = z.object({
    params: z.object({ productId: z.coerce.number().int().positive() }),
    body: z.object({
        stock: z.coerce.number().int().nonnegative(),
        price: z.coerce.number().nonnegative(),
        image: z.string().min(1),
        idSize: z.coerce.number().int().positive(),
        idColor: z.coerce.number().int().positive(),
    }),
});

export const updateVariantSchema = z.object({
    params: z.object({ id: z.coerce.number().int().positive() }),
    body: z.object({
        stock: z.coerce.number().int().nonnegative().optional(),
        price: z.coerce.number().nonnegative().optional(),
        image: z.string().min(1).optional(),
        idSize: z.coerce.number().int().positive().optional(),
        idColor: z.coerce.number().int().positive().optional(),
    }).strict(),
});