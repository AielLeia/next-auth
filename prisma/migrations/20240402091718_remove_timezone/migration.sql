-- AlterTable
ALTER TABLE "User" ALTER COLUMN "emailVerified" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "VerificationToken" ALTER COLUMN "expires" SET DATA TYPE TIMESTAMP(3);
