import { z } from "zod";

const orderDetailSchema = z.object({
    quantity: z.coerce.number().int().positive(),
    price: z.coerce.number().nonnegative(),
    varianteId: z.coerce.number().int().positive(),
});

export const createOrderSchema = z.object({
    body: z.object({
        totalPrice: z.coerce.number().nonnegative(),
        orderDetails: z.array(orderDetailSchema).min(1),
    }),
});

export const updateOrderSchema = z.object({
    params: z.object({ id: z.coerce.number().int().positive() }),
    body: z.object({ status: z.enum(["pending", "paid", "delivered"]) }).strict(),
});