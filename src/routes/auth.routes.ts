import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import * as authController from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { loginSchema, refreshTokenSchema, registerSchema } from "../validators/auth.validator.js";

const router = Router();
/**
 * @openapi
 * /api/v1/auth/register:
 *   post:
 *     summary: Inscrire un utilisateur
 *     tags: [Authentification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/RegisterInput' }
 *     responses:
 *       201: { description: Utilisateur créé }
 *       409: { description: Adresse email déjà utilisée }
 */
router.post("/register", validate(registerSchema), asyncHandler(authController.register));

/**
 * @openapi
 * /api/v1/auth/login:
 *   post:
 *     summary: Connecter un utilisateur
 *     tags: [Authentification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/LoginInput' }
 *     responses:
 *       200: { description: Tokens générés }
 *       401: { description: Identifiants invalides }
 */
router.post("/login", validate(loginSchema), asyncHandler(authController.login));

/**
 * @openapi
 * /api/v1/auth/refresh:
 *   post:
 *     summary: Renouveler les tokens
 *     tags: [Authentification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/TokenInput' }
 *     responses:
 *       200: { description: Tokens renouvelés }
 */
router.post("/refresh", validate(refreshTokenSchema), asyncHandler(authController.refresh));

/**
 * @openapi
 * /api/v1/auth/logout:
 *   post:
 *     summary: Révoquer un refresh token
 *     tags: [Authentification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/TokenInput' }
 *     responses:
 *       204: { description: Session terminée }
 */
router.post("/logout", validate(refreshTokenSchema), asyncHandler(authController.logout));

export default router;