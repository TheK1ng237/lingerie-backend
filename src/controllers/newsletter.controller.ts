import { Request, Response } from "express";
import { prisma } from "../config/database.js";
import env from "../config/env.js";
import { AppError } from "../utils/AppError.js";

const RESEND_API_URL = "https://api.resend.com/emails";

export async function subscribe(req: Request, res: Response): Promise<void> {
    const email = req.body.email as string;

    await prisma.newsletterSubscriber.upsert({
        where: { email },
        update: { isActive: true },
        create: { email },
    });

    res.status(201).json({
        status: true,
        message: "Inscription à la newsletter confirmée.",
    });
}

export async function getSubscribers(_req: Request, res: Response): Promise<void> {
    const subscribers = await prisma.newsletterSubscriber.findMany({ orderBy: { createdAt: "desc" } });
    res.json({ status: true, data: subscribers });
}

export async function updateSubscriber(req: Request, res: Response): Promise<void> {
    const subscriber = await prisma.newsletterSubscriber.update({
        where: { id: Number(req.params.id) },
        data: { isActive: req.body.isActive },
    });
    res.json({ status: true, data: subscriber });
}

export async function deleteSubscriber(req: Request, res: Response): Promise<void> {
    await prisma.newsletterSubscriber.delete({ where: { id: Number(req.params.id) } });
    res.status(204).send();
}

export async function getCampaigns(_req: Request, res: Response): Promise<void> {
    const campaigns = await prisma.newsletterCampaign.findMany({ orderBy: { createdAt: "desc" } });
    res.json({ status: true, data: campaigns });
}

export async function createCampaign(req: Request, res: Response): Promise<void> {
    const campaign = await prisma.newsletterCampaign.create({ data: req.body });
    res.status(201).json({ status: true, data: campaign });
}

export async function updateCampaign(req: Request, res: Response): Promise<void> {
    const campaign = await prisma.newsletterCampaign.update({
        where: { id: Number(req.params.id) },
        data: req.body,
    });
    res.json({ status: true, data: campaign });
}

export async function deleteCampaign(req: Request, res: Response): Promise<void> {
    await prisma.newsletterCampaign.delete({ where: { id: Number(req.params.id) } });
    res.status(204).send();
}

export async function sendCampaign(req: Request, res: Response): Promise<void> {
    if (!env.RESEND_API_KEY || !env.NEWSLETTER_FROM_EMAIL) {
        throw new AppError("Le service email n'est pas configuré. Ajoutez RESEND_API_KEY et NEWSLETTER_FROM_EMAIL.", 503);
    }

    const campaign = await prisma.newsletterCampaign.findUnique({ where: { id: Number(req.params.id) } });
    if (!campaign) throw new AppError("Campagne introuvable.", 404);

    const subscribers = await prisma.newsletterSubscriber.findMany({
        where: { isActive: true },
        select: { email: true },
    });
    if (subscribers.length === 0) throw new AppError("Aucun abonné actif à contacter.", 400);

    const html = buildNewsletterEmail(campaign);
    const failedEmails: string[] = [];

    for (const subscriber of subscribers) {
        const response = await fetch(RESEND_API_URL, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${env.RESEND_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                from: env.NEWSLETTER_FROM_EMAIL,
                to: [subscriber.email],
                subject: campaign.subject,
                html,
            }),
        });

        if (!response.ok) failedEmails.push(subscriber.email);
    }

    const sentCount = subscribers.length - failedEmails.length;
    await prisma.newsletterCampaign.update({
        where: { id: campaign.id },
        data: { status: failedEmails.length === 0 ? "sent" : "partial" },
    });

    res.json({
        status: failedEmails.length === 0,
        message: failedEmails.length === 0
            ? `${sentCount} email(s) envoyé(s).`
            : `${sentCount} email(s) envoyé(s), ${failedEmails.length} échec(s).`,
        data: { sentCount, failedCount: failedEmails.length },
    });
}

function escapeHtml(value: string): string {
    return value.replace(/[&<>'"]/g, (character) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        '"': "&quot;",
    })[character] ?? character);
}

function buildNewsletterEmail(campaign: {
        title: string;
        subject: string;
        content: string;
        discountCode: string | null;
        discountPercent: number | null;
}): string {
        const siteUrl = env.NEWSLETTER_SITE_URL.replace(/\/$/, "");
        const content = campaign.content
                .split(/\r?\n/)
                .filter((line) => line.trim())
                .map((line) => `<p style="margin:0 0 16px;">${escapeHtml(line)}</p>`)
                .join("");
        const promotion = campaign.discountCode || campaign.discountPercent
                ? `<div style="margin:28px 0;padding:22px;text-align:center;background:#fff1f5;border:1px solid #f9a8c0;border-radius:12px;">
                        <p style="margin:0 0 8px;color:#9d174d;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">Avantage privé</p>
                        ${campaign.discountPercent ? `<p style="margin:0;color:#831843;font-size:34px;font-weight:800;">-${campaign.discountPercent}%</p>` : ""}
                        ${campaign.discountCode ? `<p style="margin:10px 0 0;color:#500724;font-size:13px;">Code : <strong style="letter-spacing:2px;">${escapeHtml(campaign.discountCode)}</strong></p>` : ""}
                </div>`
                : "";

        return `<!doctype html>
<html lang="fr">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <title>${escapeHtml(campaign.subject)}</title>
    </head>
    <body style="margin:0;padding:0;background:#f5f1f2;color:#292524;font-family:Arial,Helvetica,sans-serif;">
        <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(campaign.title)} · Une invitation privée de Lingerie.</div>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f5f1f2;">
            <tr><td align="center" style="padding:32px 16px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:620px;background:#ffffff;border:1px solid #eadde1;">
                    <tr><td style="padding:30px 32px;background:#171114;text-align:center;">
                        <p style="margin:0;color:#ffffff;font-family:Georgia,serif;font-size:26px;font-style:italic;letter-spacing:4px;">LINGERIE</p>
                        <p style="margin:10px 0 0;color:#f9a8c0;font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;">Le cercle privé</p>
                    </td></tr>
                    <tr><td style="padding:42px 32px 30px;">
                        <p style="margin:0 0 12px;color:#be185d;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">Invitation exclusive</p>
                        <h1 style="margin:0 0 22px;color:#1c1917;font-family:Georgia,serif;font-size:34px;font-weight:400;line-height:1.2;">${escapeHtml(campaign.title)}</h1>
                        <div style="color:#57534e;font-size:16px;line-height:1.75;">${content}</div>
                        ${promotion}
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:30px auto 8px;"><tr><td style="border-radius:5px;background:#be185d;text-align:center;">
                            <a href="${siteUrl}/cathalog" style="display:inline-block;padding:15px 26px;color:#ffffff;font-size:12px;font-weight:700;letter-spacing:1px;text-decoration:none;text-transform:uppercase;">Découvrir la collection</a>
                        </td></tr></table>
                    </td></tr>
                    <tr><td style="padding:24px 32px;background:#faf7f8;border-top:1px solid #f1e5e8;text-align:center;">
                        <p style="margin:0;color:#78716c;font-size:11px;line-height:1.6;">Vous recevez cet email car vous êtes membre du cercle privé Lingerie.</p>
                        <a href="${siteUrl}/#contact" style="display:inline-block;margin-top:10px;color:#a8a29e;font-size:11px;text-decoration:underline;">Gérer mes préférences</a>
                    </td></tr>
                </table>
                <p style="margin:18px 0 0;color:#a8a29e;font-size:10px;">Lingerie · Douala, Cameroun</p>
            </td></tr>
        </table>
    </body>
</html>`;
}
