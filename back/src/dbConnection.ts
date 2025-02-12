import pgp from "pg-promise";
import dotenv from "dotenv";

dotenv.config();

export const pgClient = pgp()({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : undefined,
  database: process.env.DB_NAME,
});
