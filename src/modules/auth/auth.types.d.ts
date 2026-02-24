export type SignUpEmail = {
    name: string;
    email: string;
    password: string;
};

export type SignInEmail = {
    email: string;
    password: string;
};

export type ResetPasswordPayload = {
    token: string;
    newPassword: string;
};

export type VoidResult = Record<string, never>;

export type AuthLoginResult = {
    accessToken: string;
    refreshToken: string;
    user: unknown; // চাইলে Prisma user type বসাতে পারো
};