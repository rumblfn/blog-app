import { DataSourceOptions } from "typeorm";
import { User, Post, Token } from "../entities";

export const config: DataSourceOptions = {
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, Post, Token],
  synchronize: true,
  logging: false,
};
