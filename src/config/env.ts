import z from "zod";
import "dotenv/config";
import { env } from "process";


const envScema = z.object({

    NODE_ENV: z.enum(["development","production","test"]).default ("development"),
    PORT : z.coerce.number().default(4000),
    DATABASE_URL: z.string().url(),
    JWT_ACCESS_SECRET: z.string().min(32,"JWT secret must be at least 32 characters long"),
    JWT_REFRESH_SECRET: z.string().min(32,"JWT secret must be at least 32 characters long"),
    JWT_ACCESS_EXPIRATION_MINUTES: z.coerce.number().default(15),
    JWT_REFRESH_EXPIRATION_DAYS: z.coerce.number().default(7),
    CORS_ORIGIN: z.string().default(""),
    SUPABASE_URL: z.string().url().optional(),
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
    SUPABASE_STORAGE_BUCKET: z.string().min(1).default("product-images"),
    RATE_LIMIT_WINDOW_MS: z.coerce.number().default(15 * 60 * 1000),
    RATE_LIMIT_MAX: z.coerce.number().default(100),
    AUTH_RATE_LIMIT_WINDOW_MS: z.coerce.number().default(15 * 60 * 1000),
    AUTH_RATE_LIMIT_MAX: z.coerce.number().default(10),
    WHATSAPP_ACCESS_TOKEN: z.string().min(1).optional(),
    WHATSAPP_PHONE_NUMBER_ID: z.string().min(1).optional(),
    WHATSAPP_ADMIN_PHONE: z.string().min(8).optional(),
    WHATSAPP_GRAPH_VERSION: z.string().default("v25.0"),
    WHATSAPP_ORDER_TEMPLATE: z.string().min(1).default("order_admin_notification"),
    WHATSAPP_TEMPLATE_LANGUAGE: z.string().min(2).default("fr"),
    RESEND_API_KEY: z.string().min(1).optional(),
    NEWSLETTER_FROM_EMAIL: z.string().email().optional(),
    NEWSLETTER_SITE_URL: z.string().url().default("http://localhost:3000"),
    
})

const parsed = envScema.safeParse(process.env);

if(!parsed.success){
    console.error("Invalid environment variables",parsed.error.format());
    process.exit(1);
}

export default parsed.data;