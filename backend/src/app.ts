import express from "express";
import dotenv from "dotenv";

import "reflect-metadata";
import { AppDataSource } from "./db";
import { setupRoutes } from "./handlers/setupRoutes";

dotenv.config();

const port = process.env.PORT;

const app = express();

app.use(express.json());

app.set("view engine", "ejs");

setupRoutes(app);

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected");
    app.listen(port, () => {
      return console.log(`http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error(err);
  });
