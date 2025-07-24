import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

// export const AuthMiddleware = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   try {
//     const token = req.cookies['jwt'];

//     if (!token) {
//       res.status(401).json({ message: "Unauthenticated" });
//       return; // ← חובה לעצור כאן
//     }

//     const payload = verify(token, process.env.JWT_SECRET );
//     (req as any).user = payload;

//     next(); // ← הכל תקין, ממשיכים
//   } catch (e) {
//     res.status(401).json({ message: "Unauthenticated" });
//     return;
//   }
// };
import { getRepository } from "typeorm";
import { User } from "../entity/user.entity";
import jwt from "jsonwebtoken";

export const AuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Extract token from cookies or headers
    const token = req.cookies['jwt'] || req.headers['authorization']?.split(' ')[1];

    if (!token) {
      res.status(401).json({ message: "Unauthenticated - token missing" });
      return;
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number };

    // const user = await getRepository(User).findOne({
    //     where: { id: payload.id },
    //     relations: ["role", "role.permissions"]
    // });
    const user = await getRepository(User).findOne({
      where: { id: payload.id },
      relations: ["role", "role.permissions"]
    });
    if (!user) {
      res.status(401).json({ message: "unauthorized - user not found" });
      return;
    }

    req['user'] = user;
    next();
  } catch (e) {
    res.status(401).json({ message: "Unauthenticated" });
    return;
  }
};
