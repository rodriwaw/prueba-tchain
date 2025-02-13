import express from "express";
import { RegisterUser } from "../controllers/register.controller";
import { LoginUser } from "../controllers/login.controller";

const router = express.Router();

router.post("/login", LoginUser);

router.post("/register", RegisterUser);

export default router;
