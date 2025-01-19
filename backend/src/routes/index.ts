import { Express } from "express";
import { setupSwagger } from "../utils/swagger";

import userRouter from "./user";
import postRouter from "./post";

export const configureRoutes = (app: Express) => {
  setupSwagger(app);
  app.use("/api/users", userRouter);
  app.use("/api/posts", postRouter);
};
