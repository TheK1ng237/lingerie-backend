import { Router } from "express";
import { protect, authorize } from "../middlewares/auth.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import * as userController from "../controllers/user.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { idParamSchema } from "../validators/common.validator.js";
import { updateUserSchema } from "../validators/user.validator.js";

const router = Router();
router.use(protect);
/**
 * @openapi
 * /api/v1/users:
 *   get:
 *     summary: Lister les utilisateurs
 *     tags: [Utilisateurs]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Liste des utilisateurs }
 */
router.get("/", authorize("admin"), asyncHandler(userController.getUsers));

/**
 * @openapi
 * /api/v1/users/{id}:
 *   get:
 *     summary: Consulter un utilisateur
 *     tags: [Utilisateurs]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Utilisateur trouvé }
 */
router.get("/:id", validate(idParamSchema), asyncHandler(userController.getUser));

/**
 * @openapi
 * /api/v1/users/{id}:
 *   patch:
 *     summary: Modifier un utilisateur
 *     tags: [Utilisateurs]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/RegisterInput' }
 *     responses:
 *       200: { description: Utilisateur modifié }
 */
router.patch("/:id", validate(updateUserSchema), asyncHandler(userController.updateUser));

/**
 * @openapi
 * /api/v1/users/{id}:
 *   delete:
 *     summary: Supprimer un utilisateur
 *     tags: [Utilisateurs]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204: { description: Utilisateur supprimé }
 */
router.delete("/:id", authorize("admin"), validate(idParamSchema), asyncHandler(userController.deleteUser));

export default router;