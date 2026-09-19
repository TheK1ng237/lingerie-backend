import { z } from "zod";

export const updateUserSchema = z.object({
    params: z.object({ id: z.coerce.number().int().positive() }),
    body: z.object({
        email: z.string().email().optional(),
        password: z.string().min(8).optional(),
        firstName: z.string().min(1).optional(),
        lastName: z.string().min(1).optional(),
        adresse: z.string().min(1).optional(),
        phone: z.coerce.number().int().optional(),
    }).strict(),
});