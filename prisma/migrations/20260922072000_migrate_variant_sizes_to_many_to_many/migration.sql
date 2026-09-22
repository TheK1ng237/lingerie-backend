-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_idUser_fkey";

-- DropForeignKey
ALTER TABLE "OrderDetails" DROP CONSTRAINT "OrderDetails_orderId_fkey";

-- DropForeignKey
ALTER TABLE "OrderDetails" DROP CONSTRAINT "OrderDetails_varianteId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_brandId_fkey";

-- DropForeignKey
ALTER TABLE "RefreshToken" DROP CONSTRAINT "RefreshToken_idUser_fkey";

-- DropForeignKey
ALTER TABLE "Variante" DROP CONSTRAINT "Variante_idColor_fkey";

-- DropForeignKey
ALTER TABLE "Variante" DROP CONSTRAINT "Variante_idSize_fkey";

-- DropForeignKey
ALTER TABLE "Variante" DROP CONSTRAINT "Variante_productId_fkey";

-- AlterTable
ALTER TABLE "Variante" DROP COLUMN "idSize";

-- CreateTable
CREATE TABLE "_VarianteSizes" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_VarianteSizes_AB_unique" ON "_VarianteSizes"("A", "B");

-- CreateIndex
CREATE INDEX "_VarianteSizes_B_index" ON "_VarianteSizes"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Size_label_key" ON "Size"("label");

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderDetails" ADD CONSTRAINT "OrderDetails_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderDetails" ADD CONSTRAINT "OrderDetails_varianteId_fkey" FOREIGN KEY ("varianteId") REFERENCES "Variante"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Variante" ADD CONSTRAINT "Variante_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Variante" ADD CONSTRAINT "Variante_idColor_fkey" FOREIGN KEY ("idColor") REFERENCES "Color"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_VarianteSizes" ADD CONSTRAINT "_VarianteSizes_A_fkey" FOREIGN KEY ("A") REFERENCES "Size"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_VarianteSizes" ADD CONSTRAINT "_VarianteSizes_B_fkey" FOREIGN KEY ("B") REFERENCES "Variante"("id") ON DELETE CASCADE ON UPDATE CASCADE;