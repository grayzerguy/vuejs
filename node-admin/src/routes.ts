// ייבוא Router מתוך Express – מאפשר להגדיר קבוצת נתיבים נפרדת
import { Router } from "express";
// ייבוא פונקציית הטיפול בהרשמה מה-controller
import { Login, Register } from "./controller/auth.controller";
// יצירת מופע חדש של Router
const router = Router();

router.post("/register", Register);
router.post("/login", Login);

export default router;
