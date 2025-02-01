import { PrismaClient as AnalyticsPrismaClient } from "../../generated/analytics-db";
import { PrismaClient as UsersPrismaClient } from "../../generated/users-db";

export const analyticsPrisma = new AnalyticsPrismaClient();

const globalForPrisma = global as unknown as { prisma: UsersPrismaClient };

export const prisma =
	globalForPrisma.prisma ||
	new UsersPrismaClient({
		log: ["query"],
	});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
