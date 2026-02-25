import AppError from "../../utils/AppError.js";
import status from "http-status";
import { auth } from "../../lib/auth.js";
import { prisma } from "../../lib/prisma.js";
import {
  SignInEmail,
  SignUpEmail,
  VoidResult,
  AuthLoginResult,
} from "./auth.types.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt.js";
import { USER_STATUS } from "../../../generated/prisma/enums.js";
const signUpEmail = async (userData: SignUpEmail) => {
  const { name, email, password } = userData;

  try {
    const data = await auth.api.signUpEmail({
      body: { name, email, password },
    });

    return data;
  } catch (err: any) {
    const message =
      err?.message ||
      err?.body?.message ||
      err?.response?.data?.message ||
      "User registration failed";

    throw new AppError(status.BAD_REQUEST, message);
  }
};

const signInEmail = async (
  userData: SignInEmail,
  reqHeaders: Record<string, unknown>,
): Promise<AuthLoginResult> => {
  const { email, password } = userData;

  // ✅ 1) BetterAuth দিয়ে credential verify
  const result = await auth.api.signInEmail({
    body: { email, password },
    headers: reqHeaders as any,
  });

  if (!result?.user?.id) {
    throw new AppError(status.UNAUTHORIZED, "Invalid credentials");
  }

  // ✅ 2) DB থেকে user status/role যাচাই (কারণ BetterAuth user object সবসময় enough না)
  const user = await prisma.user.findUnique({
    where: { id: result.user.id },
  });

  if (!user) {
    throw new AppError(status.UNAUTHORIZED, "User not found");
  }

  // ⚠️ এখানে user.status যদি  schema তে না থাকে এবং userStatus থাকে,
  // তাহলে এই লাইনে user.userStatus ব্যবহার
  if (user.userStatus !== USER_STATUS.ACTIVE) {
    throw new AppError(status.FORBIDDEN, "Account is not active");
  }

  // ✅ 3) নিজের JWT issue (access + refresh)
  const accessToken = signAccessToken({ sub: user.id, role: user.role });
  const refreshToken = signRefreshToken({ sub: user.id, role: user.role });

  return {
    accessToken,
    refreshToken,
    user,
  };
};

// JWT system এ signOut মূলত client-side (token delete).
// চাইলে BetterAuth signOut কল রাখতে পারো, কিন্তু JWT invalidate করবে না (blacklist না করলে)।
const signOut = async (
  _reqHeaders: Record<string, unknown>,
): Promise<VoidResult> => {
  // optional:
  // await auth.api.signOut({ headers: _reqHeaders as any });
  return {};
};

const refreshAccessToken = async (refreshToken: string) => {
  try {
    const payload = verifyRefreshToken(refreshToken);

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user) throw new AppError(status.UNAUTHORIZED, "User not found");

    if (user.userStatus !== USER_STATUS.ACTIVE) {
      throw new AppError(status.FORBIDDEN, "Account is not active");
    }

    const newAccessToken = signAccessToken({ sub: user.id, role: user.role });

    return { accessToken: newAccessToken };
  } catch {
    throw new AppError(status.UNAUTHORIZED, "Invalid or expired refresh token");
  }
};

export const authService = {
  signUpEmail,
  signInEmail,
  signOut,
  refreshAccessToken,
};
