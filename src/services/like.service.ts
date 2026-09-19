import { prisma } from "../config/database.js";
import { AppError } from "../utils/AppError.js";

export class LikeService {
  async toggleLike(userId: number, productId: number): Promise<{ liked: boolean; count: number }> {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      throw new AppError("Produit introuvable", 404);
    }

    const existingLike = await prisma.productLike.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    let liked = false;
    if (existingLike) {
      await prisma.productLike.delete({
        where: { id: existingLike.id },
      });
      liked = false;
    } else {
      await prisma.productLike.create({
        data: {
          userId,
          productId,
        },
      });
      liked = true;
    }

    const count = await prisma.productLike.count({
      where: { productId },
    });

    return { liked, count };
  }

  async getUserLikedProductIds(userId: number): Promise<number[]> {
    const likes = await prisma.productLike.findMany({
      where: { userId },
      select: { productId: true },
    });
    return likes.map((l) => l.productId);
  }

  async getProductLikesCount(productId: number): Promise<number> {
    return prisma.productLike.count({
      where: { productId },
    });
  }
}

export default new LikeService();
