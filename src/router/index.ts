import { Router } from "express";
import { authRouter } from "../module/auth/auth.route";

const router = Router();
const moduleRoutes = [
  {
    path: "/auth",
    route: authRouter,
  },

  // উদাহরণ: { path: "/users", route: userRouter }
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export const globalRouter = router;
