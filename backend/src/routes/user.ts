import { Router, Request, Response } from "express";
import { User } from "../db/entities";
import bcrypt from "bcryptjs";
import { createJWT } from "../utils/jwt";
import { AppDataSource } from "../db";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Пользователи
 */

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Регистрация пользователя
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Пользователь зарегистрирован
 *       400:
 *         description: Ошибка в данных
 */
router.post("/register", async (req: Request, res: Response) => {
  const userRepository = AppDataSource.getRepository(User);
  const { username, password } = req.body;

  if (!(username && password)) {
    res.status(400).json({ message: "Username and password are required" });
    return;
  }

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

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Логин пользователя
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Успешный логин
 *       400:
 *         description: Неверные учетные данные
 */
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

  const token = createJWT({ id: user.id, username: user.username });
  res.json({ token });
});

export default router;
