import { Request, Response } from "express";
import authService from "../services/auth.service.js";

export async function register(req: Request, res: Response): Promise<void> {
    const user = await (await import("../services/user.service.js")).default.registerUser(req.body);
    res.status(201).json({ status: true, data: user });
}

export async function login(req: Request, res: Response): Promise<void> {
    const result = await authService.login(req.body.email, req.body.password);
    res.status(200).json({ status: true, data: result });
}

export async function refresh(req: Request, res: Response): Promise<void> {
    const result = await authService.refreshToken(req.body.refreshToken);
    res.status(200).json({ status: true, data: result });
}

export async function logout(req: Request, res: Response): Promise<void> {
    await authService.logout(req.body.refreshToken);
    res.status(204).send();
}