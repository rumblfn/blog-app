import { Request, Response, NextFunction } from "express";
import { verifyJWT } from "../utils/jwt";
import { User } from "../db/entities";
import { AppDataSource } from "../db";

export interface AuthRequest extends Request {
  user?: User;
}

export async function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    res.status(401).json({ message: "Authorization header missing" });
    return;
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "Token missing" });
    return;
  }

  const payload = verifyJWT(token);
  if (!payload) {
    res.status(401).json({ message: "Invalid or expired token" });
    return;
  }

  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOneBy({
    id: payload.id,
  });
  if (!user) {
    res.status(401).json({ message: "User not found" });
    return;
  }

  req.user = user;
  next();
}
