/*
  Warnings:

  - The values [dessous] on the enum `Type` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `category` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Category" AS ENUM ('femme', 'homme', 'enfant');

-- AlterEnum
BEGIN;
CREATE TYPE "Type_new" AS ENUM ('ensemble', 'body', 'soutien_gorge', 'pyjama', 'corset', 'culotte', 'robe', 'combinaison', 'shorty', 'boxer', 'maillot', 'slip', 'calecon', 'chaussette', 'gigoteuse');
ALTER TABLE "Product" ALTER COLUMN "type" TYPE "Type_new" USING ("type"::text::"Type_new");
ALTER TYPE "Type" RENAME TO "Type_old";
ALTER TYPE "Type_new" RENAME TO "Type";
DROP TYPE "Type_old";
COMMIT;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "category" "Category" NOT NULL;

-- CreateTable
CREATE TABLE "ProductLike" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductLike_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductLike_userId_productId_key" ON "ProductLike"("userId", "productId");

-- AddForeignKey
ALTER TABLE "ProductLike" ADD CONSTRAINT "ProductLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductLike" ADD CONSTRAINT "ProductLike_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
