import { Router, Request, Response } from "express";
import { Token, User } from "../db/entities";
import bcrypt from "bcryptjs";
import { createJWT, verifyJWT } from "../utils/jwt";
import { AppDataSource } from "../db";
import { authMiddleware, AuthRequest } from "../middleware";

const router = Router();

router.post("/register", async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!(username && password)) {
    res.status(400).json({ message: "Username and password are required" });
    return;
  }

  const userRepository = AppDataSource.getRepository(User);
  const existingUser = await userRepository.findOne({ where: { username } });
  if (existingUser) {
    res.status(400).json({ message: "Username already exists" });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = userRepository.create({ username, password: hashedPassword });
  await userRepository.save(user);

  res.status(201).json({ message: "User registered successfully" });
});

router.post("/login", async (req: Request, res: Response) => {
  const userRepository = AppDataSource.getRepository(User);
  const { username, password } = req.body;

  if (!(username && password)) {
    res.status(400).json({ message: "Username and password are required" });
    return;
  }

  const user = await userRepository.findOne({ where: { username } });
  if (!user) {
    res.status(400).json({ message: "Invalid credentials" });
    return;
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    res.status(400).json({ message: "Invalid credentials" });
    return;
  }

  const payload = { id: user.id };
  const accessToken = createJWT(payload, 15 * 60, process.env.JWT_ACCESS);
  const refreshToken = createJWT(
    payload,
    30 * 24 * 60 * 60,
    process.env.JWT_REFRESH,
  );

  const tokenRepository = AppDataSource.getRepository(Token);
  const token = await tokenRepository.findOneBy({ user });
  if (token) {
    token.refresh = refreshToken;
    await tokenRepository.save(token);
  } else {
    const newToken = tokenRepository.create({ user, refresh: refreshToken });
    await tokenRepository.save(newToken);
  }

  res.cookie("refreshToken", refreshToken, {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  });

  res.json({ token: accessToken, user: { username: user.username } });
});

router.post("/logout", authMiddleware, async (req: AuthRequest, res) => {
  const tokenRepository = AppDataSource.getRepository(Token);
  await tokenRepository.delete({ user: req.user });

  res.status(200).json({ message: "Logout completed" });
});

router.get("/refresh", async (req: AuthRequest, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      res.status(401).json({ message: "Token missing" });
      return;
    }

    const payload = verifyJWT(refreshToken, process.env.JWT_REFRESH);
    if (!payload) {
      res.status(401).json({ message: "Invalid or expired token" });
      return;
    }

    const tokenRepository = AppDataSource.getRepository(Token);
    const token = await tokenRepository.findOne({
      where: { refresh: refreshToken },
      relations: ["user"],
    });
    if (!token || !token.user) {
      res.status(401).json({ message: "Invalid or expired token" });
      return;
    }

    const accessToken = createJWT(payload, 15 * 60, process.env.JWT_ACCESS);
    const newRefreshToken = createJWT(
      payload,
      30 * 24 * 60 * 60,
      process.env.JWT_REFRESH,
    );

    token.refresh = newRefreshToken;
    await tokenRepository.save(token);

    res.cookie("refreshToken", newRefreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    res.json({ token: accessToken, user: { username: token.user.username } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
