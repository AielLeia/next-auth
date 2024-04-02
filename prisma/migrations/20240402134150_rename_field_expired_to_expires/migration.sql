/*
  Warnings:

  - You are about to drop the column `expired` on the `PasswordResetToken` table. All the data in the column will be lost.
  - Added the required column `expires` to the `PasswordResetToken` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PasswordResetToken" DROP COLUMN "expired",
ADD COLUMN     "expires" TIMESTAMP(3) NOT NULL;
