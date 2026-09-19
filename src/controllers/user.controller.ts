import { Prisma } from "@prisma/client";
import { Request, Response } from "express";
import userService from "../services/user.service.js";

export async function getUsers(_req: Request, res: Response): Promise<void> {
    res.json({ status: true, data: await userService.getAllUsers() });
}

export async function getUser(req: Request, res: Response): Promise<void> {
    res.json({ status: true, data: await userService.getUserById(Number(req.params.id)) });
}

export async function updateUser(req: Request, res: Response): Promise<void> {
    const data = { ...req.body } as Prisma.UserUpdateInput;
    if (data.password && typeof data.password === "string") {
        const { hashpassword } = await import("../utils/password.js");
        data.password = await hashpassword(data.password);
    }
    res.json({ status: true, data: await userService.updateUser(Number(req.params.id), data) });
}

export async function deleteUser(req: Request, res: Response): Promise<void> {
    await userService.deleteUser(Number(req.params.id));
    res.status(204).send();
}