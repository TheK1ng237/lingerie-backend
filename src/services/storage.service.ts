import { createClient } from "@supabase/supabase-js";
import crypto from "node:crypto";
import path from "node:path";
import env from "../config/env.js";
import { AppError } from "../utils/AppError.js";

const allowedMimeTypes = new Map([
    ["image/jpeg", ".jpg"],
    ["image/png", ".png"],
    ["image/webp", ".webp"],
    ["image/gif", ".gif"],
]);

const supabase = env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY
    ? createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)
    : null;

export interface UploadedImage {
    buffer: Buffer;
    mimetype: string;
    originalname: string;
}

export async function uploadImage(file: UploadedImage, folder: "products" | "variants"): Promise<string> {
    const extension = allowedMimeTypes.get(file.mimetype);
    if (!extension) {
        throw new AppError("Format d'image non supporte. Utilisez JPEG, PNG, WEBP ou GIF.", 400);
    }

    if (!supabase) {
        throw new AppError("Le stockage Supabase n'est pas configure.", 500);
    }

    const filePath = `${folder}/${crypto.randomUUID()}${extension}`;
    const { error } = await supabase.storage
        .from(env.SUPABASE_STORAGE_BUCKET)
        .upload(filePath, file.buffer, {
            contentType: file.mimetype,
            cacheControl: "3600",
            upsert: false,
        });

    if (error) {
        throw new AppError(`Echec de l'upload Supabase: ${error.message}`, 502);
    }

    return supabase.storage.from(env.SUPABASE_STORAGE_BUCKET).getPublicUrl(filePath).data.publicUrl;
}

export async function deleteImageByUrl(imageUrl: string | undefined): Promise<void> {
    if (!supabase || !imageUrl) return;

    const marker = `/storage/v1/object/public/${env.SUPABASE_STORAGE_BUCKET}/`;
    const markerIndex = imageUrl.indexOf(marker);
    if (markerIndex === -1) return;

    const filePath = decodeURIComponent(imageUrl.slice(markerIndex + marker.length));
    await supabase.storage.from(env.SUPABASE_STORAGE_BUCKET).remove([path.posix.normalize(filePath)]);
}