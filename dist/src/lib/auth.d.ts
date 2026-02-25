export declare const auth: import("better-auth").Auth<{
    database: (options: import("better-auth").BetterAuthOptions) => import("better-auth").DBAdapter<import("better-auth").BetterAuthOptions>;
    trustedOrigins: string[];
    user: {
        additionalFields: {
            phone: {
                type: "string";
                required: false;
            };
            isActive: {
                type: "boolean";
                required: false;
                defaultValue: true;
            };
            isDeleted: {
                type: "boolean";
                required: false;
                defaultValue: false;
            };
            role: {
                type: "string";
                required: false;
                defaultValue: "USER";
            };
            userStatus: {
                type: "string";
                required: false;
                defaultValue: "ACTIVE";
            };
        };
    };
    emailAndPassword: {
        enabled: true;
    };
}>;
//# sourceMappingURL=auth.d.ts.map