import * as EmailValidator from "email-validator";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { pgClient } from "../dbConnection";
import { Request, Response } from "express";
import { User } from "../interfaces/user.interface";

const dbConn = pgClient;
dotenv.config();

export const LoginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(200).json({
      status: "error",
      success: false,
      message: "Todos los campos son requeridos.",
    });
    return;
  } else if (!EmailValidator.validate(email)) {
    res.status(200).json({
      status: "error",
      success: false,
      message: "El email proporcionado no es válido.",
    });
    return;
  }

  const userDb = await dbConn.oneOrNone(
    "SELECT * FROM usuarios WHERE email = $1",
    [email]
  );

  if (!userDb) {
    res.status(200).json({
      status: "error",
      success: false,
      message: "El email proporcionado no está registrado.",
    });
    return;
  }

  const user: User = {
    id: userDb.id,
    name: userDb.nombre,
    lastname: userDb.apellido,
    email: userDb.email,
    deleted: userDb.eliminado,
    password: userDb.contrasena,
  };

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    res.status(200).json({
      status: "error",
      success: false,
      message: "La contraseña proporcionada es incorrecta.",
    });
    return;
  }

  user.password = "";

  const token = jwt.sign(user, process.env.TOKEN_SECRET!, {
    expiresIn: "24h",
  });

  res.status(200).json({
    status: "success",
    success: true,
    message: "Inicio de sesión exitoso.",
    token,
  });
};
