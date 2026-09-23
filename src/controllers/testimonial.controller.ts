import { Prisma } from "@prisma/client";
import { Request, Response } from "express";
import { prisma } from "../config/database.js";
import { AppError } from "../utils/AppError.js";

export async function getTestimonials(req: Request, res: Response): Promise<void> {
    const includeUnpublished = req.user?.role === "admin" && (req.query.all === "true" || req.path === "/admin");
    const testimonials = await prisma.testimonial.findMany({
        where: includeUnpublished ? undefined : { isPublished: true },
        orderBy: { createdAt: "desc" },
    });
    res.json({ status: true, data: testimonials });
}

export async function createTestimonial(req: Request, res: Response): Promise<void> {
    if (req.user?.role !== "user") {
        throw new AppError("Seuls les clients peuvent envoyer un témoignage.", 403);
    }

    const testimonial = await prisma.testimonial.create({
        data: {
            ...(req.body as Prisma.TestimonialCreateInput),
            isPublished: false,
        },
    });
    res.status(201).json({ status: true, data: testimonial });
}

export async function updateTestimonial(req: Request, res: Response): Promise<void> {
    try {
        const testimonial = await prisma.testimonial.update({
            where: { id: Number(req.params.id) },
            data: req.body as Prisma.TestimonialUpdateInput,
        });
        res.json({ status: true, data: testimonial });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
            throw new AppError("Témoignage introuvable.", 404);
        }
        throw error;
    }
}

export async function deleteTestimonial(req: Request, res: Response): Promise<void> {
    try {
        await prisma.testimonial.delete({ where: { id: Number(req.params.id) } });
        res.status(204).send();
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
            throw new AppError("Témoignage introuvable.", 404);
        }
        throw error;
    }
}