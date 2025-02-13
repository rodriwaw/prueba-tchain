import dotenv from "dotenv";
import express from "express";
import router from "./routes";
import { pgClient } from "./dbConnection";
import cors from "cors";
dotenv.config();

const PORT = process.env.PORT || 9000;

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors({
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(router);

app.listen(PORT, () => {
  pgClient.one("SELECT NOW()").then(({ now }) => {
    console.log(`Postgres connected at ${now}`);
  });
  console.log(`Listening on port ${PORT}`);
});
