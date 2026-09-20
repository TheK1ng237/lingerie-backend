import { Router, Request, Response } from "express";
import multer from "multer";
import { protect, authorize } from "../middlewares/auth.middleware.js";
import { uploadImage } from "../services/storage.service.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 },
});

const router = Router();

router.post(
    "/",
    protect,
    authorize("admin"),
    upload.any(),
    asyncHandler(async (req: Request, res: Response) => {
        const files = req.files as Express.Multer.File[];
        const file = files && files.length > 0 ? files[0] : null;

        if (!file) {
            throw new AppError("Aucun fichier image fourni dans la requête.", 400);
        }

        const folder = req.body.folder === "variants" ? "variants" : "products";
        const url = await uploadImage(file, folder);

        res.status(200).json({
            status: true,
            data: { url },
        });
    })
);

export default router;
