import { z } from "zod";

const testimonialFields = {
    authorName: z.string().trim().min(1).max(100),
    authorRole: z.string().trim().max(100).optional().nullable(),
    content: z.string().trim().min(10).max(1000),
    rating: z.coerce.number().int().min(1).max(5),
    isPublished: z.coerce.boolean().optional(),
};

export const createTestimonialSchema = z.object({
    body: z.object(testimonialFields),
});

export const updateTestimonialSchema = z.object({
    params: z.object({ id: z.coerce.number().int().positive() }),
    body: z.object(testimonialFields).partial().strict(),
});