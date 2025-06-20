import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface PrismaConnectSuccess {
  (): void;
}

interface PrismaConnectError {
  (error: unknown): void;
}

prisma.$connect()
  .then((() => {
    console.log("[Prisma] Connected to DB.");
  }) as PrismaConnectSuccess)
  .catch(((error: unknown) => {
    console.error("[Prisma] Failed to connect:", error);
  }) as PrismaConnectError);

export { prisma };
