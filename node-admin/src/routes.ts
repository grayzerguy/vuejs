import { Router } from "express";

import { AuthMiddleware } from "./middleware/auth.middleware";
import { AuthenticatedUser, Login, Logout, Register, updateUser } from "./controller/auth.controller";
import { authRateLimiter } from "./middleware/rate-limit.middleware";

const router = Router();

// הרשמה
router.post("/register", authRateLimiter, Register);

// התחברות
router.post("/login", authRateLimiter, Login);

// משתמש מחובר (דורש טוקן jwt)
router.get("/user", AuthMiddleware, AuthenticatedUser);

// יציאה (מנקה את ה-cookie)
router.post("/logout", AuthMiddleware, Logout);

router.put("/update-user", AuthMiddleware, authRateLimiter, updateUser);

export default router;
