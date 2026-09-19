import { z } from "zod";

export const registerSchema = z.object({
    body: z.object({
        email: z.string().email(),
        password: z.string().min(8),
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        adresse: z.string().min(1),
        phone: z.coerce.number().int(),
    }),
});

export const loginSchema = z.object({
    body: z.object({ email: z.string().email(), password: z.string().min(1) }),
});

export const refreshTokenSchema = z.object({
    body: z.object({ refreshToken: z.string().min(1) }),
});