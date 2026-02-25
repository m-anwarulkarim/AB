/**
 * Standardized API Response Sender
 */
const sendResponse = (res, payload) => {
    const { statusCode, success, message = "Success", data, meta, } = payload;
    res.status(statusCode).json({
        success,
        message,
        ...(meta && { meta }),
        ...(data !== undefined && { data }),
    });
};
export default sendResponse;
//# sourceMappingURL=sendResponse.js.map