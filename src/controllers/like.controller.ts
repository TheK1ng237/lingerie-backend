import { Request, Response } from "express";
import likeService from "../services/like.service.js";

export async function toggleLike(req: Request, res: Response): Promise<void> {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ status: false, message: "Non authentifié" });
    return;
  }

  const productId = Number(req.params.id);
  const result = await likeService.toggleLike(userId, productId);
  res.status(200).json({ status: true, data: result });
}

export async function getMyLikes(req: Request, res: Response): Promise<void> {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ status: false, message: "Non authentifié" });
    return;
  }

  const productIds = await likeService.getUserLikedProductIds(userId);
  res.status(200).json({ status: true, data: productIds });
}

export async function getProductLikesCount(req: Request, res: Response): Promise<void> {
  const productId = Number(req.params.id);
  const count = await likeService.getProductLikesCount(productId);
  res.status(200).json({ status: true, data: { count } });
}
