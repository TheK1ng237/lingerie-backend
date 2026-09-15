/*
  Warnings:

  - Added the required column `image` to the `Variante` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Variante" ADD COLUMN     "image" TEXT NOT NULL;
