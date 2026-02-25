import type { NextFunction, Request, Response } from "express";
import { UserRole } from "../../generated/prisma/enums.js";
declare const authGuard: (...allowedRoles: UserRole[]) => (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export default authGuard;
//# sourceMappingURL=auth.guard.d.ts.map