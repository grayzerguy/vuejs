// ייבוא Router מתוך Express – מאפשר להגדיר קבוצת נתיבים נפרדת
import { Router } from "express";
// ייבוא פונקציית הטיפול בהרשמה מה-controller
import { Register } from "./controller/auth.controller";
// יצירת מופע חדש של Router
const router = Router();
// הגדרת נתיב POST להרשמה (למשל: POST ל־/api/register)
// בפועל הנתיב יהיה: /api/register (כי prefix "/api" נוסף ב־index.ts)
router.post("/register", Register); // ⬅️ שים לב: הנתיב עצמו בלי "/api"
// ייצוא ברירת מחדל של ה־router כדי לשלב אותו ב־index.ts
export default router;
