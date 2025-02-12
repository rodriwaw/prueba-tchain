import express from "express";
import { RegisterUser } from "../controllers/register.controller";

const router = express.Router();

//router.post("/login", LoginUser);

router.post("/register", RegisterUser);

export default router;
