-- AlterTable
ALTER TABLE "Otp" ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL DEFAULT (now() + interval '10 minutes');
