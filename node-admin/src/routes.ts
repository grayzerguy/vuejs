
// routes.ts
import { Router } from "express";
import { Register } from "./controller/auth.controller";
//import { Register } from "./controllers/auth.controller";

const router = Router();

router.post("/api/register", Register);

export default router;

