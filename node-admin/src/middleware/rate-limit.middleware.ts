import rateLimit from "express-rate-limit";

// מגביל עד 5 בקשות כל 15 דקות
export const authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 10000, // 15 דקות
    max: 25,
    message: {
        message: "Too many requests from this IP, please try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});
