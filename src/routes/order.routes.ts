import { Router } from "express";
import { protect, authorize } from "../middlewares/auth.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import * as orderController from "../controllers/order.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { idParamSchema } from "../validators/common.validator.js";
import { createOrderSchema, updateOrderSchema } from "../validators/order.validator.js";

const router = Router();
router.use(protect);
/**
 * @openapi
 * /api/v1/orders:
 *   post:
 *     summary: Créer une commande
 *     tags: [Commandes]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/OrderInput' }
 *     responses:
 *       201: { description: Commande créée }
 */
router.post("/", validate(createOrderSchema), asyncHandler(orderController.createOrder));

/**
 * @openapi
 * /api/v1/orders/mine:
 *   get:
 *     summary: Lister mes commandes
 *     tags: [Commandes]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Commandes de l'utilisateur connecté }
 */
router.get("/mine", asyncHandler(orderController.getMyOrders));

/**
 * @openapi
 * /api/v1/orders/{id}:
 *   get:
 *     summary: Consulter une commande
 *     tags: [Commandes]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Commande trouvée }
 */
router.get("/:id", validate(idParamSchema), asyncHandler(orderController.getOrder));

/**
 * @openapi
 * /api/v1/orders:
 *   get:
 *     summary: Lister toutes les commandes
 *     tags: [Commandes]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Liste des commandes, réservé aux administrateurs }
 */
router.get("/", authorize("admin"), asyncHandler(orderController.getOrders));

/**
 * @openapi
 * /api/v1/orders/{id}:
 *   patch:
 *     summary: Modifier le statut d'une commande
 *     tags: [Commandes]
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
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status: { type: string, enum: [pending, paid, delivered] }
 *     responses:
 *       200: { description: Commande modifiée }
 */
router.patch("/:id", authorize("admin"), validate(updateOrderSchema), asyncHandler(orderController.updateOrder));

/**
 * @openapi
 * /api/v1/orders/{id}:
 *   delete:
 *     summary: Supprimer une commande
 *     tags: [Commandes]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204: { description: Commande supprimée }
 */
router.delete("/:id", authorize("admin"), validate(idParamSchema), asyncHandler(orderController.deleteOrder));

export default router;