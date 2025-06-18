import { Request, Response, NextFunction } from "express";
import { RegisterValidation } from "../user-validation/register.validation";

export const Register = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {

  const body = req.body;
 // בצע ולידציה עם האפשרויות מסכמה (כולל allowUnknown: false)
  const { error } = RegisterValidation.validate(body);

  if (error) {

    res.status(400).json({
      error: error.details.map((e) => e.message),
    });
    return;
  }

  if (body.password !== body.password_confirm) {
    res.status(400).json({
      error: "Passwords do not match",
    });
    return;
  }

  res.status(200).json({
    message: "Registration successful",
    data: {
      email: body.email,
    },
  });
};
