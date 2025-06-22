// ייבוא Router מתוך Express – מאפשר להגדיר קבוצת נתיבים נפרדת
import { Router } from "express";
// ייבוא פונקציית הטיפול בהרשמה מה-controller
import { AuthenticatedUser, Login, Logout, Register } from "./controller/auth.controller";
import { console } from "inspector";
// יצירת מופע חדש של Router
const router = Router();

router.post("/register", Register);
router.post("/login", Login as any);
router.get('/user/', AuthenticatedUser  as any);
router.post('/logout', Logout );

export default router;

console.log("✅ Routes are set up");