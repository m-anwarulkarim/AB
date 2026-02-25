import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma.js";
import { USER_STATUS, UserRole } from "../../generated/prisma/enums.js";

export const auth = betterAuth({
    database: prismaAdapter(prisma, { provider: "postgresql" }),
    trustedOrigins: [process.env.FRONTEND_URL || "http://localhost:3000", "http://localhost:5000"],
    user: {
        additionalFields: {
            phone: { type: "string", required: false },
            isActive: { type: "boolean", required: false, defaultValue: true },
            isDeleted: { type: "boolean", required: false, defaultValue: false },
            role: { type: "string", required: false, defaultValue: UserRole.USER },
            userStatus: { type: "string", required: false, defaultValue: USER_STATUS.ACTIVE }
        },
    },
    emailAndPassword: { enabled: true },
});