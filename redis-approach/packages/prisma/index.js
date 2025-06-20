import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
prisma.$connect()
    .then((() => {
    console.log("[Prisma] Connected to DB.");
}))
    .catch(((error) => {
    console.error("[Prisma] Failed to connect:", error);
}));
export { prisma };
//# sourceMappingURL=index.js.map