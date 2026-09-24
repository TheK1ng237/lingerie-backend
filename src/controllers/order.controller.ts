import { Prisma } from "@prisma/client";
import { Request, Response } from "express";
import orderService from "../services/order.service.js";
import { prisma } from "../config/database.js";
import { AppError } from "../utils/AppError.js";
import { notifyAdminOfOrder } from "../services/whatsapp.service.js";

export async function getOrders(_req: Request, res: Response): Promise<void> {
    res.json({ status: true, data: await orderService.getAllOrder() });
}

export async function getMyOrders(req: Request, res: Response): Promise<void> {
    res.json({ status: true, data: await orderService.getUserOrder(req.user!.id) });
}

export async function getOrder(req: Request, res: Response): Promise<void> {
    res.json({ status: true, data: await orderService.getOrderById(Number(req.params.id)) });
}

export async function createOrder(req: Request, res: Response): Promise<void> {
    const { totalPrice, orderDetails } = req.body;
    const variantIds = orderDetails.map((detail: { varianteId: number }) => Number(detail.varianteId));
    const existingVariants = await prisma.variante.findMany({
        where: { id: { in: variantIds } },
        select: { id: true },
    });
    const existingVariantIds = new Set(existingVariants.map((variant) => variant.id));
    const missingVariantId = variantIds.find((id: number) => !existingVariantIds.has(id));

    if (missingVariantId !== undefined) {
        throw new AppError(`La variante ${missingVariantId} n'existe plus.`, 400);
    }

    const quantitiesByVariant = new Map<number, number>();
    for (const detail of orderDetails) {
        const variantId = Number(detail.varianteId);
        quantitiesByVariant.set(
            variantId,
            (quantitiesByVariant.get(variantId) || 0) + Number(detail.quantity)
        );
    }

    const data: Prisma.OrderCreateInput = {
        totalPrice: Number(totalPrice),
        user: { connect: { id: req.user!.id } },
        orderDetails: { create: orderDetails },
    };

    const order = await prisma.$transaction(async (transaction) => {
        for (const [variantId, quantity] of quantitiesByVariant) {
            const updated = await transaction.variante.updateMany({
                where: { id: variantId, stock: { gte: quantity } },
                data: { stock: { decrement: quantity } },
            });

            if (updated.count !== 1) {
                throw new AppError(`Stock insuffisant pour la variante ${variantId}.`, 409);
            }
        }

        return transaction.order.create({
            data,
            include: { orderDetails: true },
        });
    });

    const customer = await prisma.user.findUnique({
        where: { id: req.user!.id },
        select: { firstName: true, lastName: true },
    });
    void notifyAdminOfOrder({
        orderId: order.id,
        customerName: `${customer?.firstName || "Client"} ${customer?.lastName || ""}`.trim(),
        totalPrice: Number(totalPrice),
        itemCount: orderDetails.reduce((total: number, detail: { quantity: number }) => total + Number(detail.quantity), 0),
    });

    res.status(201).json({ status: true, data: order });
}

export async function updateOrder(req: Request, res: Response): Promise<void> {
    res.json({ status: true, data: await orderService.updateOrderById(Number(req.params.id), req.body) });
}

export async function deleteOrder(req: Request, res: Response): Promise<void> {
    await orderService.deletOrder(Number(req.params.id));
    res.status(204).send();
}