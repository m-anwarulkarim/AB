import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import status from "http-status";
import { authService } from "./auth.service.js";
const signUpEmail = catchAsync(async (req, res) => {
    const user = await authService.signUpEmail(req.body);
    sendResponse(res, {
        statusCode: status.CREATED,
        success: true,
        message: "User created successfully",
        data: user,
    });
});
const signInEmail = catchAsync(async (req, res) => {
    const data = await authService.signInEmail(req.body, req.headers);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "User login successfully",
        data,
    });
});
const signOut = catchAsync(async (req, res) => {
    const data = await authService.signOut(req.headers);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "User signed out successfully",
        data,
    });
});
const refresh = catchAsync(async (req, res) => {
    const { refreshToken } = req.body;
    const data = await authService.refreshAccessToken(refreshToken);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Access token refreshed",
        data,
    });
});
export const authController = {
    signUpEmail,
    signInEmail,
    signOut,
    refresh,
};
//# sourceMappingURL=auth.controller.js.map