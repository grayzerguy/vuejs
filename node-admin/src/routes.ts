import { Router } from "express";
import { AuthMiddleware } from "./middleware/auth.middleware";
import { AuthenticatedUser, ChangePassword, ForgotPassword, Login, Logout, Register, UpdateUser, VerifyResetCodeAndChangePassword } from "./controller/auth.controller";
import { AuthRateLimiter } from "./middleware/rate-limit.middleware";
import { CreateUser,  DeleteUserById,  GetAllUsers, GetUser, UpdateUserById } from "./controller/user.controller";




const router = Router();

router.post("/register", AuthRateLimiter, Register);// Register a new user
router.post("/login", AuthRateLimiter, Login);// Login user
router.get("/user", AuthMiddleware, AuthenticatedUser);// Get authenticated user
router.post("/logout", AuthMiddleware, Logout);// Logout user
router.put("/update-user", AuthMiddleware, AuthRateLimiter, UpdateUser);// Update user
router.put("/change-password", AuthMiddleware, ChangePassword);// Change user password
router.post("/forgot-password", ForgotPassword);// Forgot password
router.post("/reset-password", VerifyResetCodeAndChangePassword);// Reset password

router.get("/all-users", AuthMiddleware, GetAllUsers);// Get all users (for admin purposes, protected by AuthMiddleware if needed)
router.post('/users', AuthMiddleware, CreateUser);// Create a new user (for admin purposes, protected by AuthMiddleware)
router.get('/get-one-user-by-id/:id', AuthMiddleware, GetUser);// Get a user by ID (for admin purposes, protected by AuthMiddleware)
router.put('/update-user-by-id/:id', AuthMiddleware, UpdateUserById);// Update a user by ID (for admin purposes, protected by AuthMiddleware)
router.delete('/delete-users-by-id/:id', AuthMiddleware, DeleteUserById  );// Delete a user by ID (for admin purposes, protected by AuthMiddleware)

export default router;
