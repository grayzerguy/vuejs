import { Request, Response } from "express";
import { getManager } from "typeorm";

import bcryptjs from "bcryptjs";
import { sign, verify } from "jsonwebtoken";
import { RegisterValidation } from "../user-validation/register.validation";

import { User } from "../entity/user.entity";
import { formatUserResponse } from "../utils/format";
import { sanitizeUserUpdate } from "../utils/sanitize";
import { ChangePasswordValidation, ForgotPasswordValidation } from "../user-validation/update.validation";
import { sendEmail } from "../utils/send-email";

export const Register = async (req: Request, res: Response): Promise<void> => {
  const body = req.body;

  const { error } = RegisterValidation.validate(body);
  if (error) {
    res.status(400).json({
      error: error.details.map((e) => e.message),
    });
    return;
  }

  const repository = getManager().getRepository(User);

  const existingUser = await repository.findOne({ where: { email: body.email } });
  if (existingUser) {
    res.status(400).json({ message: "Email is already in use" });
    return;
  }

  const hashedPassword = await bcryptjs.hash(body.password, 10);

  const user = repository.create({
    first_name: body.first_name,
    last_name: body.last_name,
    email: body.email,
    password: hashedPassword,
  });

  await repository.save(user);

  res.status(201).json({
    message: "Registration successful",
    data: formatUserResponse(user),
  });
};

export const Login = async (req: Request, res: Response): Promise<void> => {
  try {
    const repository = getManager().getRepository(User);
    const user = await repository.findOne({ where: { email: req.body.email } });

    if (!user || !(await bcryptjs.compare(req.body.password, user.password))) {
      res.status(400).send({ message: "Invalid credentials!" });
      return;
    }

    const token = sign({ id: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 24 * 3600000,
    });

    res.send({ message: "success" });
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }
};

export const AuthenticatedUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const jwt = req.cookies["jwt"];
    const payload: any = verify(jwt, process.env.JWT_SECRET || "secret");

    const repository = getManager().getRepository(User);
    const user = await repository.findOne({ where: { id: payload.id } });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.send(formatUserResponse(user));
  } catch (error) {
    res.status(401).json({ message: "Unauthenticated" });
  }
};



export const Logout = async (req: Request, res: Response): Promise<void> => {
  res.cookie("jwt", "", {
    httpOnly: true,
    maxAge: 0,
  });
  res.send({ message: "Logged out successfully" });
};
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  const user = req["user"];
  if (!user) {
    res.status(401).send({ message: "Unauthorized" });
    return;
  }

  let updateData = sanitizeUserUpdate(req.body);

  if (updateData.password) {
    updateData.password = await bcryptjs.hash(updateData.password, 10);
  }

  const repository = getManager().getRepository(User);
  await repository.update(user.id, updateData);

  res.send({ message: "User updated successfully" });
};

export const ChangePassword = async (req: Request, res: Response): Promise<void> => {
  const user = req["user"];
  const { error, value } = ChangePasswordValidation.validate(req.body);

  if (error) {
    res.status(400).json({ error: error.details.map(d => d.message) });
    return;
  }

  const repository = getManager().getRepository(User);
  const dbUser = await repository.findOne({ where: { id: user.id } });

  if (!dbUser) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  const isValid = await bcryptjs.compare(value.old_password, dbUser.password);
  if (!isValid) {
    res.status(400).json({ message: "Old password is incorrect" });
    return;
  }

  const hashedNewPassword = await bcryptjs.hash(value.new_password, 10);
  await repository.update(user.id, { password: hashedNewPassword });

  res.status(200).json({ message: "Password updated successfully" });
};




export const ForgotPassword = async (req: Request, res: Response) => {

  const { error, value } = ForgotPasswordValidation.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details.map(d => d.message) });
  }

  const repository = getManager().getRepository(User);
  const user = await repository.findOne({ where: { email: value.email } });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // הדפסת טוקן/לינק לאיפוס (בהמשך תוכל לשלוח מייל)
  const resetToken = sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: "15m" });
  const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;

  await sendEmail(
    user.email,
    "Password Reset",
    `<p>Click <a href="${resetLink}">here</a> to reset your password</p>`
  );

  console.log("🔗 Reset link:", resetLink);

  res.status(200).json({ message: "Reset link sent (printed to console for now)" });
};
