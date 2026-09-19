import { Prisma } from "@prisma/client";
import { Request, Response } from "express";
import orderService from "../services/order.service.js";

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
    const data: Prisma.OrderCreateInput = {
        totalPrice: Number(totalPrice),
        user: { connect: { id: req.user!.id } },
        orderDetails: { create: orderDetails },
    };
    res.status(201).json({ status: true, data: await orderService.createOrder(data) });
}

export async function updateOrder(req: Request, res: Response): Promise<void> {
    res.json({ status: true, data: await orderService.updateOrderById(Number(req.params.id), req.body) });
}

export async function deleteOrder(req: Request, res: Response): Promise<void> {
    await orderService.deletOrder(Number(req.params.id));
    res.status(204).send();
}