import "dotenv/config";
import { PrismaClient, Role, Category, Type } from "@prisma/client";
import { hashpassword } from "../src/utils/password.js";

const prisma = new PrismaClient();

const typeMapping: Record<string, Type> = {
  "ensemble": Type.ensemble,
  "body": Type.body,
  "soutien-gorge": Type.soutien_gorge,
  "soutien_gorge": Type.soutien_gorge,
  "pyjama": Type.pyjama,
  "corset": Type.corset,
  "culotte": Type.culotte,
  "robe": Type.robe,
  "combinaison": Type.combinaison,
  "shorty": Type.shorty,
  "boxer": Type.boxer,
  "maillot": Type.maillot,
  "slip": Type.slip,
  "calecon": Type.calecon,
  "chaussette": Type.chaussette,
  "gigoteuse": Type.gigoteuse,
};

const categoryMapping: Record<string, Category> = {
  "femme": Category.femme,
  "homme": Category.homme,
  "enfant": Category.enfant,
};


// v58UAcyfAR3q19z5
const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "Admin123!";
const userPassword = process.env.SEED_USER_PASSWORD ?? "User123!";

const productsData = [
  {
    id: 1,
    categorie: "femme",
    type: "ensemble",
    image: "/femme/image21.jpg",
    collection: "Collection garo",
    title: `Ensemble "Rêve"`,
    desc: "Dentelle française avec broderies artisanales",
    price: 14900,
    variants: [
      { color: "red", size: "S", stock: 5 },
      { color: "red", size: "M", stock: 3 },
      { color: "red", size: "L", stock: 4 },
      { color: "green", size: "S", stock: 2 },
      { color: "blue", size: "XL", stock: 5 },
      { color: "purple", size: "M", stock: 10 }
    ]
  },
  {
    id: 2,
    categorie: "femme",
    type: "body",
    image: "/femme/image2.jpg",
    collection: "Collection garo",
    title: `Body "Silk Touch"`,
    desc: "Soie italienne 100% pure - Coupe ajustée",
    price: 16900,
    variants: [
      { color: "red", size: "S", stock: 4 },
      { color: "red", size: "M", stock: 6 },
      { color: "green", size: "L", stock: 3 },
      { color: "blue", size: "XL", stock: 7 },
      { color: "pink", size: "M", stock: 5 }
    ]
  },
  {
    id: 3,
    categorie: "femme",
    type: "soutien-gorge",
    image: "/femme/image3.jpg",
    collection: "Collection garo",
    title: `Soutien-gorge "Aurore"`,
    desc: "Dentelle micro-mesh avec armatures invisibles",
    price: 8900,
    variants: [
      { color: "red", size: "S", stock: 8 },
      { color: "green", size: "M", stock: 4 },
      { color: "blue", size: "L", stock: 6 },
      { color: "brown", size: "XL", stock: 3 }
    ]
  },
  {
    id: 4,
    categorie: "femme",
    type: "pyjama",
    image: "/femme/image4.jpg",
    collection: "Collection garo",
    title: `Pyjama "Nuit Étoilée"`,
    desc: "Soie de mûrier - Ensemble 2 pièces",
    price: 21900,
    variants: [
      { color: "red", size: "S", stock: 2 },
      { color: "green", size: "M", stock: 5 },
      { color: "blue", size: "L", stock: 3 },
      { color: "yellow", size: "XL", stock: 7 }
    ]
  },
  {
    id: 5,
    categorie: "femme",
    type: "corset",
    image: "/femme/image5.jpg",
    collection: "Collection garo",
    title: `Corset "Parisien"`,
    desc: "Structure en satin avec laçage dos",
    price: 24900,
    variants: [
      { color: "red", size: "S", stock: 3 },
      { color: "green", size: "M", stock: 4 },
      { color: "blue", size: "L", stock: 2 }
    ]
  },
  {
    id: 6,
    categorie: "femme",
    type: "culotte",
    image: "/femme/image6.jpg",
    collection: "Collection garo",
    title: `Culotte "Désir"`,
    desc: "Dentale stretch sans couture",
    price: 5900,
    variants: [
      { color: "red", size: "S", stock: 10 },
      { color: "green", size: "M", stock: 8 },
      { color: "blue", size: "L", stock: 6 }
    ]
  },
  {
    id: 7,
    categorie: "femme",
    type: "robe",
    image: "/femme/image7.jpg",
    collection: "Collection garo",
    title: `Robe de chambre "Opéra"`,
    desc: "Mousseline légère avec ceinture en satin",
    price: 18900,
    variants: [
      { color: "red", size: "S", stock: 4 },
      { color: "green", size: "M", stock: 3 },
      { color: "blue", size: "L", stock: 5 }
    ]
  },
  {
    id: 8,
    categorie: "femme",
    type: "combinaison",
    image: "/femme/image8.jpg",
    collection: "Collection garo",
    title: `Combinaison "Mystère"`,
    desc: "Tulle transparent avec motifs floraux",
    price: 13900,
    variants: [
      { color: "red", size: "S", stock: 7 },
      { color: "green", size: "M", stock: 5 },
      { color: "blue", size: "L", stock: 4 }
    ]
  },
  {
    id: 9,
    categorie: "femme",
    type: "shorty",
    image: "/femme/image9.jpg",
    collection: "Collection garo",
    title: `Shorty "Jardin Secret"`,
    desc: "Coton bio élastique - Confort optimal",
    price: 7500,
    variants: [
      { color: "red", size: "S", stock: 6 },
      { color: "green", size: "M", stock: 8 },
      { color: "blue", size: "L", stock: 5 }
    ]
  },
  {
    id: 10,
    categorie: "homme",
    type: "boxer",
    image: "/homme/image1.jpg",
    collection: "Collection garo",
    title: `Boxer "Elégance"`,
    desc: "Coton pima égyptien - Respirant",
    price: 6900,
    variants: [
      { color: "red", size: "S", stock: 12 },
      { color: "green", size: "M", stock: 10 },
      { color: "blue", size: "L", stock: 15 }
    ]
  },
  {
    id: 11,
    categorie: "homme",
    type: "maillot",
    image: "/homme/image2.jpg",
    collection: "Collection garo",
    title: `Maillot "Champion"`,
    desc: "Fibre technique anti-transpiration",
    price: 8900,
    variants: [
      { color: "red", size: "S", stock: 8 },
      { color: "green", size: "M", stock: 6 },
      { color: "blue", size: "L", stock: 7 }
    ]
  },
  {
    id: 12,
    categorie: "homme",
    type: "pyjama",
    image: "/homme/image3.jpg",
    collection: "Collection garo",
    title: `Pyjama "Noble"`,
    desc: "Jersey de bambou - Ensemble 2 pièces",
    price: 15900,
    variants: [
      { color: "red", size: "S", stock: 5 },
      { color: "green", size: "M", stock: 4 },
      { color: "blue", size: "L", stock: 6 }
    ]
  },
  {
    id: 13,
    categorie: "homme",
    type: "slip",
    image: "/homme/image4.jpg",
    collection: "Collection garo",
    title: `Slip "Premium"`,
    desc: "Microfibre ultra-légère",
    price: 5500,
    variants: [
      { color: "red", size: "S", stock: 10 },
      { color: "green", size: "M", stock: 12 },
      { color: "blue", size: "L", stock: 8 }
    ]
  },
  {
    id: 14,
    categorie: "homme",
    type: "robe",
    image: "/homme/image5.jpg",
    collection: "Collection garo",
    title: `Robe de chambre "Gentleman"`,
    desc: "Velours côtelé avec ceinture",
    price: 22900,
    variants: [
      { color: "red", size: "S", stock: 3 },
      { color: "green", size: "M", stock: 4 },
      { color: "blue", size: "L", stock: 2 }
    ]
  },
  {
    id: 15,
    categorie: "homme",
    type: "ensemble",
    image: "/homme/image6.jpg",
    collection: "Collection garo",
    title: `Ensemble sport "Performance"`,
    desc: "Technologie DryFit - 2 pièces",
    price: 12900,
    variants: [
      { color: "red", size: "S", stock: 7 },
      { color: "green", size: "M", stock: 5 },
      { color: "blue", size: "L", stock: 6 }
    ]
  },
  {
    id: 16,
    categorie: "homme",
    type: "calecon",
    image: "/homme/image7.jpg",
    collection: "Collection garo",
    title: `Caleçon long "Hiver"`,
    desc: "Laine mérinos thermorégulatrice",
    price: 9900,
    variants: [
      { color: "red", size: "S", stock: 4 },
      { color: "green", size: "M", stock: 3 },
      { color: "blue", size: "L", stock: 5 }
    ]
  },
  {
    id: 17,
    categorie: "homme",
    type: "boxer",
    image: "/homme/image8.jpg",
    collection: "Collection garo",
    title: `Boxer "Luxe"`,
    desc: "Soie naturelle avec boutons nacrés",
    price: 11900,
    variants: [
      { color: "red", size: "S", stock: 6 },
      { color: "green", size: "M", stock: 4 },
      { color: "blue", size: "L", stock: 5 }
    ]
  },
  {
    id: 18,
    categorie: "homme",
    type: "chaussette",
    image: "/homme/image9.jpg",
    collection: "Collection garo",
    title: `Chaussettes "Executive"`,
    desc: "Coton bio avec renforts invisibles",
    price: 4500,
    variants: [
      { color: "red", size: "S", stock: 15 },
      { color: "green", size: "M", stock: 12 },
      { color: "blue", size: "L", stock: 18 }
    ]
  },
  {
    id: 19,
    categorie: "enfant",
    type: "pyjama",
    image: "/enfant/image1.jpg",
    collection: "Collection garo",
    title: `Pyjama "Petit Panda"`,
    desc: "Coton bio imprimé - Ensemble 2 pièces",
    price: 7900,
    variants: [
      { color: "red", size: "S", stock: 8 },
      { color: "green", size: "M", stock: 6 },
      { color: "blue", size: "L", stock: 7 }
    ]
  },
  {
    id: 20,
    categorie: "enfant",
    type: "body",
    image: "/enfant/image2.jpg",
    collection: "Collection garo",
    title: `Body "Doudou"`,
    desc: "Velours doux - Boutons pression",
    price: 4500,
    variants: [
      { color: "red", size: "S", stock: 10 },
      { color: "green", size: "M", stock: 8 },
      { color: "blue", size: "L", stock: 9 }
    ]
  },
  {
    id: 21,
    categorie: "enfant",
    type: "ensemble",
    image: "/enfant/image3.jpg",
    collection: "Collection garo",
    title: `Ensemble "Étoile"`,
    desc: "Jersey stretch - Motifs phosphorescents",
    price: 6500,
    variants: [
      { color: "red", size: "S", stock: 7 },
      { color: "green", size: "M", stock: 5 },
      { color: "blue", size: "L", stock: 6 }
    ]
  },
  {
    id: 22,
    categorie: "enfant",
    type: "culotte",
    image: "/enfant/image4.jpg",
    collection: "Collection garo",
    title: `Culotte "Fée"`,
    desc: "Dentelle douce sans étiquettes",
    price: 3500,
    variants: [
      { color: "red", size: "S", stock: 12 },
      { color: "green", size: "M", stock: 10 },
      { color: "blue", size: "L", stock: 15 }
    ]
  },
  {
    id: 23,
    categorie: "enfant",
    type: "maillot",
    image: "/enfant/image5.jpg",
    collection: "Collection garo",
    title: `Maillot "Super Héros"`,
    desc: "Fibre anti-irritation",
    price: 5500,
    variants: [
      { color: "red", size: "S", stock: 9 },
      { color: "green", size: "M", stock: 7 },
      { color: "blue", size: "L", stock: 8 }
    ]
  },
  {
    id: 24,
    categorie: "enfant",
    type: "chaussette",
    image: "/enfant/image6.jpg",
    collection: "Collection garo",
    title: `Chaussettes "Animaux"`,
    desc: "Coton bio - Paires assorties",
    price: 2500,
    variants: [
      { color: "red", size: "S", stock: 20 },
      { color: "green", size: "M", stock: 18 },
      { color: "blue", size: "L", stock: 22 }
    ]
  },
  {
    id: 25,
    categorie: "enfant",
    type: "robe",
    image: "/enfant/image7.jpg",
    collection: "Collection garo",
    title: `Robe de nuit "Licorne"`,
    desc: "Flanelle légère avec capuche",
    price: 8500,
    variants: [
      { color: "red", size: "S", stock: 6 },
      { color: "green", size: "M", stock: 5 },
      { color: "blue", size: "L", stock: 4 }
    ]
  },
  {
    id: 26,
    categorie: "enfant",
    type: "slip",
    image: "/enfant/image8.jpg",
    collection: "Collection garo",
    title: `Slip "Aventure"`,
    desc: "Élastique plat - Motifs colorés",
    price: 3000,
    variants: [
      { color: "red", size: "S", stock: 15 },
      { color: "green", size: "M", stock: 12 },
      { color: "blue", size: "L", stock: 18 }
    ]
  },
  {
    id: 27,
    categorie: "enfant",
    type: "gigoteuse",
    image: "/enfant/image9.jpg",
    collection: "Collection garo",
    title: `Gigoteuse "Rêve de Bébé"`,
    desc: "Tissu respirant - Fermeture éclair",
    price: 9900,
    variants: [
      { color: "red", size: "S", stock: 5 },
      { color: "green", size: "M", stock: 4 },
      { color: "blue", size: "L", stock: 6 }
    ]
  }
];

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

  console.log(`✅ Utilisateurs seedés : ${admin.email} (${admin.role}), ${user.email} (${user.role})`);

  let brand = await prisma.brand.findFirst({
    where: { name: "Collection Garo" },
  });

  if (!brand) {
    brand = await prisma.brand.create({
      data: {
        name: "Collection Garo",
        description: "Collection de lingerie haut de gamme et vêtements délicats",
      },
    });
  }

  console.log(`✅ Marque disponible : ${brand.name} (ID: ${brand.id})`);

  for (const item of productsData) {
    const catEnum = categoryMapping[item.categorie] || Category.femme;
    const typeEnum = typeMapping[item.type] || Type.ensemble;

    const product = await prisma.product.upsert({
      where: { id: item.id },
      update: {
        name: item.title,
        description: item.desc,
        price: item.price,
        image: item.image,
        category: catEnum,
        type: typeEnum,
        brandId: brand.id,
      },
      create: {
        id: item.id,
        name: item.title,
        description: item.desc,
        price: item.price,
        image: item.image,
        category: catEnum,
        type: typeEnum,
        brandId: brand.id,
      },
    });

    for (const v of item.variants) {
      let colorRecord = await prisma.color.findFirst({
        where: { code: v.color },
      });
      if (!colorRecord) {
        colorRecord = await prisma.color.create({
          data: { code: v.color },
        });
      }

      let sizeRecord = await prisma.size.findFirst({
        where: { label: v.size },
      });
      if (!sizeRecord) {
        sizeRecord = await prisma.size.create({
          data: { label: v.size },
        });
      }

      const existingVariant = await prisma.variante.findFirst({
        where: {
          productId: product.id,
          idColor: colorRecord.id,
          idSize: sizeRecord.id,
        },
      });

      const variantImg = (v as { color: string; size: string; stock: number; image?: string }).image || item.image;

      if (!existingVariant) {
        await prisma.variante.create({
          data: {
            productId: product.id,
            idColor: colorRecord.id,
            idSize: sizeRecord.id,
            stock: v.stock,
            price: item.price,
            image: variantImg,
          },
        });
      } else {
        await prisma.variante.update({
          where: { id: existingVariant.id },
          data: {
            stock: v.stock,
            price: item.price,
            image: variantImg,
          },
        });
      }
    }
  }

  try {
    await prisma.$executeRawUnsafe(`SELECT setval(pg_get_serial_sequence('"Product"', 'id'), (SELECT COALESCE(MAX(id), 1) FROM "Product"));`);
    await prisma.$executeRawUnsafe(`SELECT setval(pg_get_serial_sequence('"Variante"', 'id'), (SELECT COALESCE(MAX(id), 1) FROM "Variante"));`);
    await prisma.$executeRawUnsafe(`SELECT setval(pg_get_serial_sequence('"User"', 'id'), (SELECT COALESCE(MAX(id), 1) FROM "User"));`);
    await prisma.$executeRawUnsafe(`SELECT setval(pg_get_serial_sequence('"Order"', 'id'), (SELECT COALESCE(MAX(id), 1) FROM "Order"));`);
  } catch (seqError) {
    console.warn("Remarque : Réinitialisation séquences PostgreSQL ignorée :", seqError);
  }

  console.log(`✅ ${productsData.length} produits et leurs variantes ont été insérés en base de données avec succès !`);
}

main()
  .catch((error) => {
    console.error("Erreur pendant le seed des données:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });