import * as EmailValidator from "email-validator";
import bcrypt from "bcrypt";
import passwordValidator from "password-validator";
import { pgClient } from "../dbConnection";
import { NextFunction, Request, Response } from "express";
import { User } from "../interfaces/user.interface";

const dbConn = pgClient;

export const RegisterUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password, name, lastname } = req.body;

  if (!email || !password || !name || !lastname) {
    res.status(400).json({
      status: "error",
      success: false,
      message: "Todos los campos son requeridos.",
    });
    return;
  }

  const userExists = await dbConn.oneOrNone(
    "SELECT * FROM usuarios WHERE email = $1",
    [email]
  );

  if (userExists) {
    res.status(400).json({
      status: "error",
      success: false,
      message: "El email proporcionado ya ha sido registrado.",
    });
    return;
  } else if (!EmailValidator.validate(email)) {
    res.status(400).json({
      status: "error",
      success: false,
      message: "El email proporcionado no es válido.",
    });
    return;
  } else if (
    new passwordValidator()
      .is()
      .min(8)
      .is()
      .max(100)
      .has()
      .digits()
      .has()
      .letters()
      .has()
      .uppercase()
      .has()
      .lowercase()
      .validate(password) === false
  ) {
    res.status(400).json({
      status: "error",
      success: false,
      message:
        "La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula y un número.",
    });
    return;
  }

  const salt = await bcrypt.genSalt(12);
  const hash = await bcrypt.hash(password, salt);

  try {
    const userDb = await dbConn.one(
      "INSERT INTO usuarios (email, contrasena, apellidos, nombre) VALUES ($1, $2, $3, $4) RETURNING *",
      [email, hash, lastname, name]
    );

    const user: User = {
      email: userDb.email,
      name: userDb.nombre,
      lastname: userDb.apellidos,
      password: "",
    };

    res
      .status(201)
      .json({
        status: "success",
        success: true,
        message: "Usuario creado exitosamente.",
        data: user,
      })
      .redirect("/login");
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({
        status: "error",
        success: false,
        message: error.message,
      });
    } else {
      res.status(500).json({
        status: "error",
        success: false,
        message: "Ha ocurrido un error desconocido.",
      });
    }
  }
};
