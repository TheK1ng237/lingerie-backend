import { PrismaClient } from "@prisma/client";

class Database {

    private static instance: PrismaClient;
    private constructor() { }

    public static getInstance(): PrismaClient {

        if (!Database.instance) {

            Database.instance = new PrismaClient({
                log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn', 'info'] : ['error']
            })
        }
        return Database.instance
    }
}

const prisma = Database.getInstance()

export async function connectDB(): Promise<void> {

    try {

        await prisma.$connect();
        console.log("✅ Connexion à la base de données établie avec succès.")
    } catch (err) {

        console.error("❌ Échec de la connexion à la base de données:", err)
        process.exit(1)
    }

}

export async function disconnectDB(): Promise<void> {

    try {
        await prisma.$disconnect()
        console.log("🔌 Connexion à la base de données fermée.")
    } catch (err) {
        console.error("❌ erreur survenu lors de la connexion à la base de données:", err)
    }
}

process.on('SIGINT', async () => {
    await disconnectDB()
    process.exit(0);
})

process.on('SIGTERM', async () => {
    await disconnectDB();
    process.exit(0);
})