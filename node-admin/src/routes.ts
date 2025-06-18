import { Router } from "express";
import { Register } from "./controller/auth.controller";

const router = Router();

router.post("/register", Register); // <--- הורד את /api

export default router;
