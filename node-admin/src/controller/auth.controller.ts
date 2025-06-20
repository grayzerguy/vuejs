// ייבוא סוגי הבקשה/תגובה/next מ-Express
import { Request, Response, NextFunction } from "express";

// ייבוא סכמת הולידציה שהגדרת עם Joi
import { RegisterValidation } from "../user-validation/register.validation";
import { getManager } from "typeorm";
import { User } from "../entity/user.entity";
import bcryptjs from "bcryptjs";

// פונקציית בקר (controller) שמטפלת בהרשמה
export const Register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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

  const repository = getManager().getRepository<User>(User);
  await repository.save({
    first_name: body.first_name,
    last_name: body.last_name,
    email: body.email,
    password: await bcryptjs.hash(body.password, 10)

  })
  // כל הנתונים תקינים – הרשמה הצליחה
  res.status(200).json({
    message: "Registration successful",
    data: {
      email: body.email, // מחזיר רק את המייל לדוגמה – לא מחזיר סיסמה!
    },
  });
};


