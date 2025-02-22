/*
  Warnings:

  - You are about to drop the column `qrcode` on the `CryptoAddress` table. All the data in the column will be lost.
  - Added the required column `qrImage` to the `CryptoAddress` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CryptoAddress" DROP COLUMN "qrcode",
ADD COLUMN     "qrImage" TEXT NOT NULL;
