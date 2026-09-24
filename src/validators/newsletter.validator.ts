import { z } from "zod";

export const subscribeNewsletterSchema = z.object({
    body: z.object({
        email: z.string().trim().toLowerCase().email(),
    }),
});

export const updateSubscriberSchema = z.object({
    body: z.object({
        isActive: z.boolean(),
    }),
});

export const campaignSchema = z.object({
    body: z.object({
        title: z.string().trim().min(2).max(120),
        subject: z.string().trim().min(2).max(160),
        content: z.string().trim().min(10),
        discountCode: z.string().trim().max(40).optional().or(z.literal("")),
        discountPercent: z.coerce.number().int().min(1).max(100).optional(),
        startsAt: z.coerce.date().optional().nullable(),
        endsAt: z.coerce.date().optional().nullable(),
        status: z.enum(["draft", "scheduled", "sent"]).optional(),
    }),
});

export const updateCampaignSchema = z.object({
    body: campaignSchema.shape.body.partial(),
});
