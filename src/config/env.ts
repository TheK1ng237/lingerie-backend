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
    RATE_LIMIT_WINDOW_MS: z.coerce.number().default(15 * 60 * 1000),
    RATE_LIMIT_MAX: z.coerce.number().default(100),
    
})

const parsed = envScema.safeParse(process.env);

if(!parsed.success){
    console.error("Invalid environment variables",parsed.error.format());
    process.exit(1);
}

export default parsed.data;