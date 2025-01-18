import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import swaggerSpec from "../_docs/swagger";

import userRouter from "../routes/user";
import postRouter from "../routes/post";

export const setupRoutes = (app: Express) => {
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.use("/api/users", userRouter);
  app.use("/api/posts", postRouter);
};
