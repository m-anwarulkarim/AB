/**
 * catchAsync
 * Async controller এর error automatically next() এ পাঠানোর wrapper
 */
const catchAsync = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
export default catchAsync;
//# sourceMappingURL=catchAsync.js.map