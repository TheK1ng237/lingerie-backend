import { Router } from "express";
import { protect, authorize } from "../middlewares/auth.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import * as productController from "../controllers/product.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { idParamSchema, productIdParamSchema } from "../validators/common.validator.js";
import { createProductSchema, createVariantSchema, updateProductSchema, updateVariantSchema } from "../validators/product.validator.js";
import { uploadProductImage, uploadVariantImage } from "../middlewares/image-upload.middleware.js";

const router = Router();
/**
 * @openapi
 * /api/v1/products:
 *   get:
 *     summary: Lister les produits du catalogue
 *     tags: [Produits]
 *     responses:
 *       200:
 *         description: Liste des produits avec leurs variantes
 */
router.get("/", asyncHandler(productController.getProducts));
router.get("/most-ordered", asyncHandler(productController.getMostOrderedProducts));
router.get("/most-liked", asyncHandler(productController.getMostLikedProducts));

/**
 * @openapi
 * /api/v1/products/{id}:
 *   get:
 *     summary: Consulter un produit
 *     tags: [Produits]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Produit trouvé }
 *       404: { description: Produit introuvable }
 */
router.get("/:id", validate(idParamSchema), asyncHandler(productController.getProduct));

/**
 * @openapi
 * /api/v1/products/variants/{id}:
 *   get:
 *     summary: Consulter une variante
 *     tags: [Produits]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Variante trouvée }
 */
import * as likeController from "../controllers/like.controller.js";

router.post("/likes/mine", protect, asyncHandler(likeController.getMyLikes));
router.get("/likes/mine", protect, asyncHandler(likeController.getMyLikes));
router.post("/:id/like", protect, validate(idParamSchema), asyncHandler(likeController.toggleLike));
router.get("/:id/likes", validate(idParamSchema), asyncHandler(likeController.getProductLikesCount));

router.use(protect, authorize("admin"));

/**
 * @openapi
 * /api/v1/products:
 *   post:
 *     summary: Créer un produit
 *     tags: [Produits]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema: { $ref: '#/components/schemas/ProductInput' }
 *     responses:
 *       201: { description: Produit créé }
 */
router.post("/", uploadProductImage, validate(createProductSchema), asyncHandler(productController.createProduct));

/**
 * @openapi
 * /api/v1/products/{id}:
 *   patch:
 *     summary: Modifier un produit
 *     tags: [Produits]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema: { $ref: '#/components/schemas/ProductInput' }
 *     responses:
 *       200: { description: Produit modifié }
 */
router.patch("/:id", uploadProductImage, validate(updateProductSchema), asyncHandler(productController.updateProduct));

/**
 * @openapi
 * /api/v1/products/{id}:
 *   delete:
 *     summary: Supprimer un produit
 *     tags: [Produits]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204: { description: Produit supprimé }
 */
router.delete("/:id", validate(idParamSchema), asyncHandler(productController.deleteProduct));

/**
 * @openapi
 * /api/v1/products/{productId}/variants:
 *   post:
 *     summary: Ajouter une variante à un produit
 *     tags: [Produits]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema: { $ref: '#/components/schemas/VariantInput' }
 *     responses:
 *       201: { description: Variante créée }
 */
router.post("/:productId/variants", uploadVariantImage, validate(createVariantSchema), asyncHandler(productController.createVariant));

/**
 * @openapi
 * /api/v1/products/variants/{id}:
 *   patch:
 *     summary: Modifier une variante
 *     tags: [Produits]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema: { $ref: '#/components/schemas/VariantInput' }
 *     responses:
 *       200: { description: Variante modifiée }
 */
router.patch("/variants/:id", uploadVariantImage, validate(updateVariantSchema), asyncHandler(productController.updateVariant));

/**
 * @openapi
 * /api/v1/products/variants/{id}:
 *   delete:
 *     summary: Supprimer une variante
 *     tags: [Produits]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204: { description: Variante supprimée }
 */
router.delete("/variants/:id", validate(idParamSchema), asyncHandler(productController.deleteVariant));

export default router;