import { Router } from "express";

import { AuthMiddleware } from "./middleware/auth.middleware";



import { AuthenticatedUser, ChangePassword, ForgotPassword, Login, Logout, Register, UpdateUser, VerifyResetCodeAndChangePassword } from "./controller/auth.controller";
import { CreateUser, DeleteUser, GetAllUsers, GetUser } from "./controller/user.controller";
import { AuthRateLimiter } from "./middleware/rate-limit.middleware";



const router = Router();

router.post("/register", AuthRateLimiter, Register);// Register a new user
router.post("/login", AuthRateLimiter, Login);// Login user
router.get("/user", AuthMiddleware, AuthenticatedUser);// Get authenticated user
router.post("/logout", AuthMiddleware, Logout);// Logout user
router.put("/update-user", AuthMiddleware, AuthRateLimiter, UpdateUser);// Update user
router.put("/change-password", AuthMiddleware, ChangePassword);// Change user password
router.post("/forgot-password", ForgotPassword);// Forgot password
router.post("/reset-password", VerifyResetCodeAndChangePassword);// Reset password


router.get("/users", AuthMiddleware, GetAllUsers);// Get all users
router.get("/users/:id", AuthMiddleware, GetUser);// Get user by ID
router.post("/users", AuthMiddleware, CreateUser);// Create a new user
router.put('/api/users/:id', AuthMiddleware, UpdateUser);// Update user by ID
router.delete('/api/users/:id', AuthMiddleware, DeleteUser);// Delete user by ID

export default router;
