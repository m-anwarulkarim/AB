import jwt from "jsonwebtoken";
const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
// ✅ expires টাইপ ঠিক করে দিলাম
const ACCESS_EXPIRES = process.env.JWT_ACCESS_EXPIRES || "15m";
const REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES || "30d";
if (!ACCESS_SECRET || !REFRESH_SECRET) {
    throw new Error("JWT secrets missing. Set JWT_ACCESS_SECRET & JWT_REFRESH_SECRET in .env");
}
export const signAccessToken = (payload) => {
    const options = { expiresIn: ACCESS_EXPIRES };
    return jwt.sign(payload, ACCESS_SECRET, options);
};
export const signRefreshToken = (payload) => {
    const options = { expiresIn: REFRESH_EXPIRES };
    return jwt.sign(payload, REFRESH_SECRET, options);
};
export const verifyAccessToken = (token) => {
    return jwt.verify(token, ACCESS_SECRET);
};
export const verifyRefreshToken = (token) => {
    return jwt.verify(token, REFRESH_SECRET);
};
//# sourceMappingURL=jwt.js.map