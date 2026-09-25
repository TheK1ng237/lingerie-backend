import env from "../config/env.js";
import logger from "../config/logger.js";

interface OrderNotification {
    orderId: number;
    customerName: string;
    totalPrice: number;
    itemCount: number;
}

export async function notifyAdminOfOrder(order: OrderNotification): Promise<void> {
    const { WHATSAPP_ACCESS_TOKEN, WHATSAPP_PHONE_NUMBER_ID, WHATSAPP_ADMIN_PHONE } = env;

    if (!WHATSAPP_ACCESS_TOKEN || !WHATSAPP_PHONE_NUMBER_ID || !WHATSAPP_ADMIN_PHONE) {
        logger.warn("WhatsApp notification skipped: missing WhatsApp environment variables");
        return;
    }

    try {
        const response = await fetch(
            `https://graph.facebook.com/${env.WHATSAPP_GRAPH_VERSION}/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    messaging_product: "whatsapp",
                    recipient_type: "individual",
                    to: WHATSAPP_ADMIN_PHONE,
                    type: "template",
                    template: {
                        name: env.WHATSAPP_ORDER_TEMPLATE,
                        language: { code: env.WHATSAPP_TEMPLATE_LANGUAGE },
                        components: [{
                            type: "body",
                            parameters: [
                                { type: "text", text: order.customerName },
                                { type: "text", text: `CMD-${order.orderId}` },
                                { type: "text", text: String(order.itemCount) },
                                { type: "text", text: `${order.totalPrice.toLocaleString("fr-FR")} FCFA` },
                            ],
                        }],
                    },
                }),
            }
        );

        if (!response.ok) {
            const details = await response.text();
            logger.error(
                {
                    status: response.status,
                    details,
                    phoneNumberId: WHATSAPP_PHONE_NUMBER_ID,
                    templateName: env.WHATSAPP_ORDER_TEMPLATE,
                    templateLanguage: env.WHATSAPP_TEMPLATE_LANGUAGE,
                },
                "WhatsApp notification failed"
            );
            return;
        }

        logger.info({ orderId: order.orderId }, "WhatsApp order notification sent");
    } catch (error) {
        logger.error({ error, orderId: order.orderId }, "WhatsApp notification request failed");
    }
}