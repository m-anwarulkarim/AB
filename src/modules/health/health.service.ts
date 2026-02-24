// src/modules/health/health.service.ts

export const healthService = () => {
    return {
        success: true,
        message: "Server is running",
        uptime: process.uptime(),
        timestamp: new Date(),
    };
};