import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import "reflect-metadata";
import { AppDataSource } from "./db";
import { configureRoutes } from "./routes";
import { corsOptions } from "./utils/corsOptions";

dotenv.config();

const port = process.env.PORT;

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

app.set("view engine", "ejs");

configureRoutes(app);

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
