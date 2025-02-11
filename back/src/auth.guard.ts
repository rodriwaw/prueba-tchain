import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
export const authGuard = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    if (req.path === "/register" || req.path === "/login") {
      next();
      return;
    }
    res.status(401).json({
      status: "error",
      success: false,
      message: "No se ha proporcionado un token.",
    });
    return;
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET ?? "secret");
    req.body.user = decoded;
    if (req.path === "/register" || req.path === "/login") {
      res.redirect("/dashboard");
      return;
    }
    next();
  } catch (err) {
    res.status(401).json({
      status: "error",
      success: false,
      message: "Token inválido.",
    });
  }
};
