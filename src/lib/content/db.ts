// Database client placeholder
// When a PostgreSQL database is connected, uncomment and use Prisma:
//
// import { PrismaClient } from "@prisma/client";
// const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
// export const prisma = globalForPrisma.prisma || new PrismaClient();
// if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// For now, data is served from the in-memory aesthetic-db module.
// This will be replaced when PostgreSQL + pgvector is provisioned.

export const DATABASE_STATUS = {
  connected: false,
  provider: "in-memory" as "in-memory" | "postgresql",
  message:
    "Using in-memory data store. Set DATABASE_URL in .env to connect PostgreSQL.",
};
