import { User } from "../../generated/prisma/client.js";

global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export {};
