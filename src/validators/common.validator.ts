import { z } from "zod";

export const idParamSchema = z.object({
    params: z.object({ id: z.coerce.number().int().positive() }),
});

export const productIdParamSchema = z.object({
    params: z.object({ productId: z.coerce.number().int().positive() }),
});