import "dotenv/config";
import { PrismaClient, Role } from "@prisma/client";
import { hashpassword } from "../src/utils/password.js";

const prisma = new PrismaClient();

async function seedAdminProduction(): Promise<void> {
  try {
    console.log("🔍 Vérification de la présence d'un administrateur en base de données...");

    const adminEmail = (process.env.ADMIN_EMAIL || "admin@lingerie.com").trim();

    // 1. Vérifier si un administrateur existe déjà (par rôle admin ou par l'email configuré)
    const existingAdmin = await prisma.user.findFirst({
      where: {
        OR: [
          { role: Role.admin },
          { email: { equals: adminEmail, mode: "insensitive" } }
        ]
      },
    });

    if (existingAdmin) {
      console.log(`ℹ️ Un administrateur existe déjà dans la base (Email: ${existingAdmin.email}, ID: ${existingAdmin.id}). Aucun compte n'a été créé.`);
      return;
    }

    // 2. Charger les informations de l'administrateur depuis le fichier .env
    const rawPassword = process.env.ADMIN_PASSWORD || "Admin123!";
    const firstName = process.env.ADMIN_FIRST_NAME || "Admin";
    const lastName = process.env.ADMIN_LAST_NAME || "Principal";
    const adresse = process.env.ADMIN_ADDRESS || "Siège Lingerie";
    const phone = Number(process.env.ADMIN_PHONE) || 600000000;

    console.log(`⏳ Création du compte administrateur de production pour ${adminEmail}...`);

    const hashedPassword = await hashpassword(rawPassword);

    const newAdmin = await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        firstName,
        lastName,
        role: Role.admin,
        adresse,
        phone,
      },
    });

    console.log(`✅ Compte administrateur créé avec succès !`);
    console.log(`   - ID      : ${newAdmin.id}`);
    console.log(`   - Email   : ${newAdmin.email}`);
    console.log(`   - Prénom  : ${newAdmin.firstName}`);
    console.log(`   - Nom     : ${newAdmin.lastName}`);
    console.log(`   - Rôle    : ${newAdmin.role}`);
  } catch (error) {
    console.error("❌ Erreur lors de l'exécution du seed administrateur de production :", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedAdminProduction();
