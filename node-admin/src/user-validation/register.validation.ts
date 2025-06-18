// ייבוא Joi – ספריית ולידציה פופולרית לבדיקת שדות בטפסים / בקשות
import Joi from "joi";
// יצירת סכמה לבדיקה של נתוני הרשמה
export const RegisterValidation = Joi.object({
    first_name: Joi.string().min(3).required(),
    last_name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    password_confirm: Joi.string().required(),
}).options({
    // הצג את כל השגיאות יחד, ולא רק את הראשונה
    abortEarly: false,
    // אל תאפשר שדות נוספים שלא הוגדרו בסכמה
    allowUnknown: false
});
