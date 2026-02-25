import { SignInEmail, SignUpEmail, VoidResult, AuthLoginResult } from "./auth.types.js";
export declare const authService: {
    signUpEmail: (userData: SignUpEmail) => Promise<{
        token: null;
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined | undefined;
            role: string | null | undefined;
            userStatus: string | null | undefined;
            isActive: boolean | null | undefined;
            isDeleted: boolean | null | undefined;
            phone?: string | null | undefined;
        };
    } | {
        token: string;
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined | undefined;
            role: string | null | undefined;
            userStatus: string | null | undefined;
            isActive: boolean | null | undefined;
            isDeleted: boolean | null | undefined;
            phone?: string | null | undefined;
        };
    }>;
    signInEmail: (userData: SignInEmail, reqHeaders: Record<string, unknown>) => Promise<AuthLoginResult>;
    signOut: (_reqHeaders: Record<string, unknown>) => Promise<VoidResult>;
    refreshAccessToken: (refreshToken: string) => Promise<{
        accessToken: string;
    }>;
};
//# sourceMappingURL=auth.service.d.ts.map