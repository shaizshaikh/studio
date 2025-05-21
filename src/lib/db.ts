// src/lib/db.ts
import { PrismaClient } from '@prisma/client';

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-unused-vars
  var prisma: PrismaClient | undefined;
}

// Prisma Client will automatically detect if DATABASE_URL is a Prisma Accelerate (Data Proxy)
// URL (i.e., starts with "prisma://") and use it accordingly.
// No explicit 'datasources' override is needed in the constructor for Accelerate.
const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma;
