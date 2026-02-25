import type { NextFunction, Request, Response } from "express";
import { prisma } from "./prisma.js";
import { verifyAccessToken } from "../utils/jwt.js";
import { USER_STATUS, UserRole } from "../../generated/prisma/enums.js";

const authGuard = (...allowedRoles: UserRole[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const authHeader = req.headers.authorization || "";

            if (!authHeader.startsWith("Bearer ")) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized - Missing Bearer token",
                });
            }

            const token = authHeader.split(" ")[1];

            const payload = verifyAccessToken(token!);

            const user = await prisma.user.findUnique({
                where: { id: payload.sub },
            });

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: "User not found",
                });
            }

            if (user.userStatus !== USER_STATUS.ACTIVE) {
                return res.status(403).json({
                    success: false,
                    message: "Account is not active",
                });
            }

            if (allowedRoles.length && !allowedRoles.includes(user.role)) {
                return res.status(403).json({
                    success: false,
                    message: "Insufficient permissions",
                });
            }

            req.user = user as any;
            next();
        } catch {
            return res.status(401).json({
                success: false,
                message: "Unauthorized - Invalid or expired token",
            });
        }
    };
};

export default authGuard;