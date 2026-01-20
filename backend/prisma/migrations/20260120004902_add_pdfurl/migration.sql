/*
  Warnings:

  - Added the required column `pdfUrl` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN "pdfUrl" TEXT;

UPDATE "Product"
SET "pdfUrl" = 'http://localhost:3000/public/uploads/def.pdf'
WHERE "pdfUrl" is null;

ALTER TABLE "Product" ALTER COLUMN "pdfUrl" SET NOT NULL;
