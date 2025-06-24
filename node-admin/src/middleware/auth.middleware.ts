import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

export const AuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies['jwt'];

    if (!token) {
      res.status(401).json({ message: "Unauthenticated" });
      return; // ← חובה לעצור כאן
    }

    const payload = verify(token, process.env.JWT_SECRET );
    (req as any).user = payload;

    next(); // ← הכל תקין, ממשיכים
  } catch (e) {
    res.status(401).json({ message: "Unauthenticated" });
    return;
  }
};
