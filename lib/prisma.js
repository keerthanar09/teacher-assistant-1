import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

const prisma = globalForPrisma.prisma || new PrismaClient({
  log: ['warn', 'error'],
  // Disabling prepared statements (dev workaround)
  datasources: {
    db: {
      url: process.env.POSTGRES_PRISMA_URL,
    },
  },
  __internal: { engine: { enableExperimental: ['postgresqlPreparedStatements=false'] } },
});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
