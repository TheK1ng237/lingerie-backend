import { z } from "zod";

const productFields = {
    name: z.string().min(1),
    description: z.string().min(1),
    price: z.coerce.number().nonnegative(),
    image: z.string().min(1),
    type: z.enum(["chaussette", "dessous"]),
};

export const createProductSchema = z.object({
    body: z.object({ ...productFields, brandId: z.coerce.number().int().positive() }),
});

export const updateProductSchema = z.object({
    params: z.object({ id: z.coerce.number().int().positive() }),
    body: z.object({ ...productFields, brandId: z.coerce.number().int().positive() }).partial().strict(),
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