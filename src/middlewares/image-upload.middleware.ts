import multer from "multer";
import { NextFunction, Request, Response } from "express";
import { uploadImage } from "../services/storage.service.js";
import { AppError } from "../utils/AppError.js";

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
});

export function uploadProductImage(req: Request, res: Response, next: NextFunction): void {
    upload.single("image")(req, res, async (error) => {
        if (error) return next(error);

        try {
            if (req.file) {
                req.body.image = await uploadImage(req.file, "products");
            }
            if (req.method === "POST" && !req.file && !req.body?.image) {
                return next(new AppError("Le fichier image du produit est obligatoire.", 400));
            }
            next();
        } catch (uploadError) {
            next(uploadError);
        }
    });
}

export function uploadVariantImage(req: Request, res: Response, next: NextFunction): void {
    upload.single("image")(req, res, async (error) => {
        if (error) return next(error);

        try {
            if (req.file) {
                req.body.image = await uploadImage(req.file, "variants");
            }
            if (req.method === "POST" && !req.file && !req.body?.image) {
                return next(new AppError("Le fichier image de la variante est obligatoire.", 400));
            }
            next();
        } catch (uploadError) {
            next(uploadError);
        }
    });
}