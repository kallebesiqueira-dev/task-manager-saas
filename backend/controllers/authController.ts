import { Request, Response } from "express";
import { z } from "zod";
import { AuthServiceError, loginUser, registerUser } from "../services/authService";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const register = async (req: Request, res: Response) => {
  try {
    const payload = registerSchema.parse(req.body);
    const result = await registerUser(payload.name, payload.email, payload.password);
    res.status(201).json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(422).json({ message: "Invalid request payload", details: error.issues });
      return;
    }

    if (error instanceof AuthServiceError) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }

    res.status(500).json({ message: "Registration failed" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const payload = loginSchema.parse(req.body);
    const result = await loginUser(payload.email, payload.password);
    res.status(200).json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(422).json({ message: "Invalid request payload", details: error.issues });
      return;
    }

    if (error instanceof AuthServiceError) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }

    res.status(500).json({ message: "Login failed" });
  }
};
