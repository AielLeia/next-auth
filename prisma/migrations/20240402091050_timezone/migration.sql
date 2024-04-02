-- AlterTable
ALTER TABLE "User" ALTER COLUMN "emailVerified" SET DATA TYPE TIMESTAMPTZ(2);

-- AlterTable
ALTER TABLE "VerificationToken" ALTER COLUMN "expires" SET DATA TYPE TIMESTAMPTZ(2);
