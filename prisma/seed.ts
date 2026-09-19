import "dotenv/config";
import { PrismaClient, Role } from "@prisma/client";
import { hashpassword } from "../src/utils/password.js";

const prisma = new PrismaClient();

const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "Admin123!";
const userPassword = process.env.SEED_USER_PASSWORD ?? "User123!";

async function main(): Promise<void> {
    const admin = await prisma.user.upsert({
        where: { email: "admin@lingerie.local" },
        update: {
            firstName: "Admin",
            lastName: "Lingerie",
            role: Role.admin,
            adresse: "12 rue de la Boutique",
            phone: 600000001,
            password: await hashpassword(adminPassword),
        },
        create: {
            email: "admin@lingerie.local",
            password: await hashpassword(adminPassword),
            firstName: "Admin",
            lastName: "Lingerie",
            role: Role.admin,
            adresse: "12 rue de la Boutique",
            phone: 600000001,
        },
    });

    const user = await prisma.user.upsert({
        where: { email: "client@lingerie.local" },
        update: {
            firstName: "Client",
            lastName: "Test",
            role: Role.user,
            adresse: "25 avenue de la Mode",
            phone: 600000002,
            password: await hashpassword(userPassword),
        },
        create: {
            email: "client@lingerie.local",
            password: await hashpassword(userPassword),
            firstName: "Client",
            lastName: "Test",
            role: Role.user,
            adresse: "25 avenue de la Mode",
            phone: 600000002,
        },
    });

    console.log(`Utilisateurs seedes: ${admin.email} (${admin.role}), ${user.email} (${user.role})`);
}

main()
    .catch((error) => {
        console.error("Erreur pendant le seed des utilisateurs:", error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });