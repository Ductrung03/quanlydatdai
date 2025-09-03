import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'], // có thể bỏ nếu không cần debug
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Nếu bạn muốn export theo kiểu object db:
export const db = {
  thuaDat: prisma.thuaDat,
};
