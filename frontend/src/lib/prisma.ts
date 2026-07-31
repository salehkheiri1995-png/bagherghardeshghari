import { PrismaClient } from "@/generated/prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  // DATABASE_URL (file:./dev.db) resolves relative to schema location (prisma/).
  // At runtime, PrismaLibSQL resolves relative to CWD (frontend/).
  // So we always use the schema-relative path for the adapter.
  const adapter = new PrismaLibSQL({
    url: "file:./prisma/dev.db",
  });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
