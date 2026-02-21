import type { Request, Response } from "express";

const createAuth = (req: Request, res: Response) => {
  console.log("Hello From Controller");
};

export const authController = {
  createAuth,
};
