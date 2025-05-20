// src/lib/db.ts
import { PrismaClient } from '@prisma/client';

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-unused-vars
  var prisma: PrismaClient | undefined;
}

// When using Prisma Accelerate or a Data Proxy,
// Prisma Client automatically detects the proxy URL from the DATABASE_URL env var.
// Explicitly passing it can sometimes help in complex environments or for clarity.
const prisma =
  global.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma;
