import { Request, Response } from "express";
import { pgClient } from "../dbConnection";
import bcrypt from "bcrypt";
import passwordValidator from "password-validator";
import * as EmailValidator from "email-validator";
import { User } from "../interfaces/user.interface";
const dbConn = pgClient;

export const RegisterUser = async (req: Request, res: Response) => {
  var user: User = {
    name: req.body.name,
    lastname: req.body.lastname,
    email: req.body.email,
    password: req.body.password,
  };

  if (!user) {
    res.status(400).json({
      status: "error",
      success: false,
      message: "Todos los campos son requeridos.",
    });
    return;
  }

  const userExists = await dbConn.oneOrNone(
    "SELECT * FROM usuarios WHERE email = $1",
    [user.email]
  );

  if (userExists) {
    res.status(400).json({
      status: "error",
      success: false,
      message: "El email proporcionado ya ha sido registrado.",
    });
    return;
  } else if (!EmailValidator.validate(user.email)) {
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
      .validate(user.password) === false
  ) {
    res.status(400).json({
      status: "error",
      success: false,
      message: "La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula y un número.",
    });
    return;
  }

  const salt = await bcrypt.genSalt(12);
  const hash = await bcrypt.hash(user.password, salt);

  try {
    const useInsert = await dbConn.one(
      "INSERT INTO usuarios (email, contrasena, apellidos, nombre) VALUES ($1, $2, $3, $4) RETURNING *",
      [user.email, hash, user.lastname, user.name]
    );
    res.status(201).json({
      status: "success",
      success: true,
      message: "Usuario creado exitosamente.",
      data: useInsert,
      redirectTo: "/login",
    });
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
