import { Router, Request, Response } from "express";
import { AppDataSource } from "../db";
import { Post } from "../db/entities";
import { authMiddleware, AuthRequest } from "../middleware";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const postRepository = AppDataSource.getRepository(Post);
  const posts = await postRepository.find({ relations: ["author"] });
  res.json(posts);
});

router.post("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  const postRepository = AppDataSource.getRepository(Post);
  const { message } = req.body;

  if (!message) {
    res.status(400).json({ message: "Message is required" });
    return;
  }

  const post = postRepository.create({
    message,
    author: req.user,
  });

  await postRepository.save(post);
  res.status(201).json(post);
});

router.put("/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
  const postRepository = AppDataSource.getRepository(Post);
  const { id } = req.params;
  const { message } = req.body;

  const post = await postRepository.findOne({
    where: { id: parseInt(id) },
    relations: ["author"],
  });
  if (!post) {
    res.status(404).json({ message: "Post not found" });
    return;
  }

  if (post.author.id !== req.user!.id) {
    res.status(403).json({ message: "Not authorized to edit this post" });
    return;
  }

  post.message = message || post.message;

  await postRepository.save(post);
  res.json(post);
});

router.delete(
  "/:id",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    const postRepository = AppDataSource.getRepository(Post);
    const post = await postRepository.findOne({
      where: { id: parseInt(id) },
      relations: ["author"],
    });
    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    if (post.author.id !== req.user!.id) {
      res.status(403).json({ message: "Not authorized to delete this post" });
      return;
    }

    await postRepository.remove(post);
    res.json({ message: "Post deleted successfully" });
  },
);

export default router;
