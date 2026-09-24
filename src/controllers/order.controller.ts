import { Prisma } from "@prisma/client";
import { Request, Response } from "express";
import orderService from "../services/order.service.js";
import { prisma } from "../config/database.js";
import { AppError } from "../utils/AppError.js";
import { notifyAdminOfOrder } from "../services/whatsapp.service.js";
import env from "../config/env.js";

const RESEND_API_URL = "https://api.resend.com/emails";

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
        select: { firstName: true, lastName: true, email: true },
    });
    void notifyAdminOfOrder({
        orderId: order.id,
        customerName: `${customer?.firstName || "Client"} ${customer?.lastName || ""}`.trim(),
        totalPrice: Number(totalPrice),
        itemCount: orderDetails.reduce((total: number, detail: { quantity: number }) => total + Number(detail.quantity), 0),
    });

    const confirmationSent = customer?.email
        ? await sendOrderConfirmationEmail({
            email: customer.email,
            customerName: `${customer.firstName || "Client"} ${customer.lastName || ""}`.trim(),
            orderId: order.id,
            totalPrice: Number(totalPrice),
            itemCount: orderDetails.reduce((total: number, detail: { quantity: number }) => total + Number(detail.quantity), 0),
        })
        : false;

    res.status(201).json({ status: true, data: order, emailSent: confirmationSent });
}

async function sendOrderConfirmationEmail(data: {
    email: string;
    customerName: string;
    orderId: number;
    totalPrice: number;
    itemCount: number;
}): Promise<boolean> {
    if (!env.RESEND_API_KEY || !env.NEWSLETTER_FROM_EMAIL) return false;

    try {
        const siteUrl = env.NEWSLETTER_SITE_URL.replace(/\/$/, "");
        const response = await fetch(RESEND_API_URL, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${env.RESEND_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                from: env.NEWSLETTER_FROM_EMAIL,
                to: [data.email],
                subject: `Commande CMD-${data.orderId} confirmée | Lingerie`,
                html: buildOrderConfirmationEmail({ ...data, siteUrl }),
            }),
        });

        if (!response.ok) {
            console.error("Order confirmation email failed", await response.text());
        }
        return response.ok;
    } catch (error) {
        console.error("Order confirmation email unavailable", error);
        return false;
    }
}

function buildOrderConfirmationEmail(data: {
    customerName: string;
    orderId: number;
    totalPrice: number;
    itemCount: number;
    siteUrl: string;
}): string {
    const total = data.totalPrice.toLocaleString("fr-FR");
    return `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Commande confirmée</title></head>
<body style="margin:0;padding:0;background:#f5f1f2;color:#292524;font-family:Arial,Helvetica,sans-serif;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">Votre commande CMD-${data.orderId} est bien enregistrée.</div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f5f1f2;"><tr><td align="center" style="padding:32px 16px;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:620px;background:#fff;border:1px solid #eadde1;">
      <tr><td style="padding:30px 32px;background:#171114;text-align:center;"><p style="margin:0;color:#fff;font-family:Georgia,serif;font-size:26px;font-style:italic;letter-spacing:4px;">LINGERIE</p><p style="margin:10px 0 0;color:#f9a8c0;font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;">Merci pour votre confiance</p></td></tr>
      <tr><td style="padding:42px 32px 34px;"><div style="width:58px;height:58px;margin:0 auto 22px;border-radius:50%;background:#ecfdf5;color:#059669;text-align:center;line-height:58px;font-size:28px;">✓</div><h1 style="margin:0;text-align:center;color:#1c1917;font-family:Georgia,serif;font-size:30px;font-weight:400;">Commande confirmée</h1><p style="margin:16px 0 0;text-align:center;color:#57534e;font-size:15px;line-height:1.7;">Bonjour ${escapeHtml(data.customerName)}, votre commande a bien été enregistrée et notre équipe prépare vos pièces avec soin.</p>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:30px 0;background:#faf7f8;border:1px solid #f1e5e8;"><tr><td style="padding:18px 20px;color:#78716c;font-size:13px;">Référence</td><td align="right" style="padding:18px 20px;color:#1c1917;font-weight:700;font-size:13px;">CMD-${data.orderId}</td></tr><tr><td style="padding:0 20px 18px;color:#78716c;font-size:13px;">Articles</td><td align="right" style="padding:0 20px 18px;color:#1c1917;font-weight:700;font-size:13px;">${data.itemCount}</td></tr><tr><td style="padding:18px 20px;border-top:1px solid #eadde1;color:#78716c;font-size:13px;">Total</td><td align="right" style="padding:18px 20px;border-top:1px solid #eadde1;color:#be185d;font-weight:700;font-size:16px;">${total} FCFA</td></tr></table>
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:0 auto;"><tr><td style="border-radius:5px;background:#be185d;text-align:center;"><a href="${data.siteUrl}/client/dashboard" style="display:inline-block;padding:15px 26px;color:#fff;font-size:12px;font-weight:700;letter-spacing:1px;text-decoration:none;text-transform:uppercase;">Suivre ma commande</a></td></tr></table>
      </td></tr><tr><td style="padding:24px 32px;background:#faf7f8;border-top:1px solid #f1e5e8;text-align:center;"><p style="margin:0;color:#78716c;font-size:11px;line-height:1.6;">Livraison estimée sous 24h à 48h. Notre équipe reste à votre écoute.</p><a href="${data.siteUrl}/#contact" style="display:inline-block;margin-top:10px;color:#a8a29e;font-size:11px;text-decoration:underline;">Nous contacter</a></td></tr>
    </table><p style="margin:18px 0 0;color:#a8a29e;font-size:10px;">Lingerie · Douala, Cameroun</p>
  </td></tr></table>
</body></html>`;
}

function escapeHtml(value: string): string {
    return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] ?? character);
}

export async function updateOrder(req: Request, res: Response): Promise<void> {
    res.json({ status: true, data: await orderService.updateOrderById(Number(req.params.id), req.body) });
}

export async function deleteOrder(req: Request, res: Response): Promise<void> {
    await orderService.deletOrder(Number(req.params.id));
    res.status(204).send();
}