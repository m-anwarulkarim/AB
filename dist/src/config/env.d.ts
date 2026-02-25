type NodeEnv = "development" | "production" | "test";
interface EnvConfig {
    NODE_ENV: NodeEnv;
    PORT: number;
    DATABASE_URL: string;
    BETTER_AUTH_SECRET: string;
    BETTER_AUTH_URL: string;
    FRONTEND_URL: string;
}
export declare const envVars: EnvConfig;
export {};
//# sourceMappingURL=env.d.ts.map