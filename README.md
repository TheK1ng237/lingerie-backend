# Lingerie Backend

API Express + TypeScript pour la boutique Lingerie. Le backend utilise PostgreSQL avec Prisma, Supabase Storage pour les images et Resend pour les emails transactionnels et les campagnes newsletter.

## Stack

- Node.js 22+
- Express 5
- TypeScript
- PostgreSQL
- Prisma
- Supabase Storage
- Resend

## Prérequis

- Node.js 22 ou supérieur
- npm
- Une base PostgreSQL
- Les variables d'environnement du fichier `.env.example`

## Installation locale

```bash
npm ci
cp .env.example .env
npm run db:generate
npm run db:migrate
npm run dev
```

API locale : `http://localhost:4000`

Documentation Swagger : `http://localhost:4000/api-docs`

Healthcheck : `http://localhost:4000/health`

## Scripts

| Commande | Rôle |
| --- | --- |
| `npm run dev` | Lance le serveur en mode développement |
| `npm run build` | Compile `src` vers `dist` |
| `npm start` | Lance le build compilé |
| `npm run typecheck` | Vérifie les types sans générer de fichiers |
| `npm test` | Lance les tests Node |
| `npm run db:generate` | Génère Prisma Client |
| `npm run db:migrate` | Crée/applique une migration en local |
| `npm run db:push` | Synchronise le schéma sans migration, réservé au local |
| `npm run db:studio` | Ouvre Prisma Studio |
| `npm run render-build` | Applique les migrations de production puis compile |

## API

Toutes les routes métier sont versionnées sous `/api/v1`.

- `GET /health`
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `GET /api/v1/products`
- `GET /api/v1/products/:id`
- `POST /api/v1/orders`
- `GET /api/v1/orders/mine`
- `POST /api/v1/newsletter/subscribe`
- `GET /api/v1/newsletter/subscribers` admin
- `GET /api/v1/newsletter/campaigns` admin
- `POST /api/v1/newsletter/campaigns/:id/send` admin

Les routes protégées nécessitent un header :

```http
Authorization: Bearer <access-token>
```

## Variables d'environnement

Ne commitez jamais `.env`. Utilisez `.env.example` comme modèle.

Variables indispensables :

- `DATABASE_URL`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `CORS_ORIGIN`

Variables newsletter :

- `RESEND_API_KEY`
- `NEWSLETTER_FROM_EMAIL`
- `NEWSLETTER_SITE_URL`

Variables Supabase :

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_STORAGE_BUCKET`

Les variables WhatsApp sont optionnelles pour les notifications administrateur.

## Déploiement Render

Le fichier `render.yaml` décrit un service web Node.js avec migrations Prisma, build TypeScript et healthcheck. Dans Render, crée un **Blueprint** depuis le dépôt ou configure manuellement :

- **Root Directory** : `lingerie-backend` si le dépôt contient aussi le frontend
- **Build Command** : `npm ci && npm run render-build`
- **Start Command** : `npm start`
- **Health Check Path** : `/health`

Renseigne les variables marquées `sync: false` dans Render. Render fournit automatiquement `PORT`; l'application écoute sur `0.0.0.0`. `DATABASE_URL` doit pointer vers PostgreSQL de production. Les migrations sont appliquées pendant le build avec `prisma migrate deploy`.

## Migrations en production

Les migrations sont appliquées automatiquement par `render-build`. Utilise toujours une URL PostgreSQL de production dans `DATABASE_URL` et vérifie les migrations en local avant de pousser :

```bash
npx prisma migrate status
npm run typecheck
npm run build
```

Ne lance pas `prisma migrate dev` contre la base de production.

## GitHub Actions

Le workflow `.github/workflows/ci.yml` valide Prisma, les types, les tests et le build sur chaque pull request et chaque push vers `main`. Render prend en charge le déploiement depuis le dépôt.

## Sécurité

- Ne commitez jamais `.env` ou une clé API.
- Régénérez immédiatement tout secret exposé.
- Utilisez des secrets JWT différents entre développement et production.
- Utilisez Redis pour partager les rate limits si plusieurs instances sont déployées.
- Vérifiez `CORS_ORIGIN` en production et limitez-le au domaine frontend réel.
