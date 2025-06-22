// ייבוא סוגי הבקשה/תגובה/next מ-Express
import { Request, Response, NextFunction } from "express";

// ייבוא סכמת הולידציה שהגדרת עם Joi
import { RegisterValidation } from "../user-validation/register.validation";
import { getManager } from "typeorm";
import { User } from "../entity/user.entity";
import bcryptjs from "bcryptjs";
import { sign } from "jsonwebtoken";

// פונקציית בקר (controller) שמטפלת בהרשמה
export const Register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
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


    const { password, ...user } = await repository.save({
      first_name: body.first_name,
      last_name: body.last_name,
      email: body.email,
      password: await bcryptjs.hash(body.password, 10)

    })


    res.send(user);
  } catch (error) {
    // Handle error appropriately, e.g.:
    res.status(500).send({ message: "Internal server error" });
  }
}

export const Login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({ message: "email and password are required" });
    }

    const repository = getManager().getRepository(User);
    const user = await repository.findOne({ where: { email } });

    if (!user) {
      return res.status(404).send({ message: "invalid credentials" });
    }

    const isMatch = await bcryptjs.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).send({ message: "invalid credentials" });
    }

    const token = sign(
      { id: user.id },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "1h" }
    );

    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 24 * 3600000
    });





    return res.send({ message: "success" });

  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).send({ message: "Internal server error" });
  }
};
