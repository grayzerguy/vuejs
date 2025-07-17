import express, { Router } from "express";
import { AuthMiddleware } from "./middleware/auth.middleware";
import { AuthenticatedUser, ChangePassword, ForgotPassword, Login, Logout, Register, UpdateUser, VerifyResetCodeAndChangePassword } from "./controller/auth.controller";
import { AuthRateLimiter } from "./middleware/rate-limit.middleware";
import { CreateUser, DeleteUserById, GetAllUsers, GetUser, UpdateUserById } from "./controller/user.controller";
import { Permissions } from "./controller/permission.controller";
import { CreateRole, DeleteRole, GetRole, Roles, UpdateRole } from "./controller/role.controller";
import { CreateProduct, DeleteProduct, GetProduct, Products, UpdateProduct } from "./controller/product.controller";
import { Upload } from "./controller/image.controller";
import { Export, Orders } from "./controller/order.controller";



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
router.post('/users', CreateUser);// Create a new user (for admin purposes, protected by AuthMiddleware)
router.get('/get-one-user-by-id/:id', AuthMiddleware, GetUser);// Get a user by ID (for admin purposes, protected by AuthMiddleware)
router.put('/update-user-by-id/:id', AuthMiddleware, UpdateUserById);// Update a user by ID (for admin purposes, protected by AuthMiddleware)
router.delete('/delete-users-by-id/:id', AuthMiddleware, DeleteUserById);// Delete a user by ID (for admin purposes, protected by AuthMiddleware)

router.get('/permissions', AuthMiddleware, Permissions);

router.get('/roles', AuthMiddleware, Roles);
router.post('/roles', AuthMiddleware, CreateRole);
router.get('/roles/:id', AuthMiddleware, GetRole);
router.put('/roles/:id', AuthMiddleware, UpdateRole);
router.delete('/roles/:id', AuthMiddleware, DeleteRole);


router.get('/products', AuthMiddleware, Products);
router.post('/products', AuthMiddleware, CreateProduct);
router.get('/products/:id', AuthMiddleware, GetProduct);
router.put('/products/:id', AuthMiddleware, UpdateProduct);
router.delete('/products/:id', AuthMiddleware, DeleteProduct);


router.post('/upload', AuthMiddleware, Upload);
router.use('/uploads', express.static('./uploads'));

router.get('/orders', AuthMiddleware, Orders);
router.post('/export', AuthMiddleware, Export);

export default router;
