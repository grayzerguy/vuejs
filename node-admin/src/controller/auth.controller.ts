// ייבוא סוגי הבקשה/תגובה/next מ-Express
import { Request, Response, NextFunction } from "express";

// ייבוא סכמת הולידציה שהגדרת עם Joi
import { RegisterValidation } from "../user-validation/register.validation";

// פונקציית בקר (controller) שמטפלת בהרשמה
export const Register = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // קבלת גוף הבקשה (מה-Client)
  const body = req.body;
  // ולידציה באמצעות Joi
  const { error } = RegisterValidation.validate(body);
  // אם יש שגיאות הולידציה – החזר שגיאת 400 עם רשימת הודעות
  if (error) {
    res.status(400).json({
      error: error.details.map((e) => e.message), // מחזיר את כל השגיאות כמערך
    });
    return; // חשוב לעצור את המשך הפונקציה
  }

  // בדיקה אם הסיסמאות לא תואמות (מתבצעת ידנית כאן, כי Joi לא בודק התאמה בין שדות כברירת מחדל)
  if (body.password !== body.password_confirm) {
    res.status(400).json({
      error: "Passwords do not match",
    });
    return;
  }
  // כל הנתונים תקינים – הרשמה הצליחה
  res.status(200).json({
    message: "Registration successful",
    data: {
      email: body.email, // מחזיר רק את המייל לדוגמה – לא מחזיר סיסמה!
    },
  });
};
