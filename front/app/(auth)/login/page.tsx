"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const LoginPage: React.FC = () => {
  const router = useRouter();
  if (typeof window !== "undefined" && localStorage.getItem("token")) {
    router.push("/dashboard");
  }
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [errorLogin, setErrorLogin] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const loginFn = async (email: string, password: string) => {
    const response = await fetch(
      `http://${process.env.NEXT_PUBLIC_HOST}:${process.env.NEXT_PUBLIC_PORT}/login`,
      {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      }
    );
    const data = await response.json();
    if (data.success) {
      localStorage.setItem("token", data.token);
      window.location.href = "/dashboard";
    } else setErrorLogin(data.message);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    try {
      if (!email && !password) {
        setErrorEmail("El campo no puede estar vacío.");
        setErrorPassword("El campo no puede estar vacío.");
        return;
      } else if (!email) {
        setErrorEmail("El campo no puede estar vacío.");

        return;
      } else if (!password) {
        setErrorPassword("El campo no puede estar vacío.");
        return;
      }

      loginFn(email, password);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    if (!emailRegex.test(inputValue)) {
      setErrorEmail("El correo no es válido.");
    } else if (inputValue.length == 0) {
      setErrorEmail("El campo no puede estar vacío.");
    } else {
      setErrorEmail("");
    }
    setEmail(inputValue);
  };

  const handleChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    if (inputValue.length == 0) {
      setErrorPassword("El campo no puede estar vacío.");
    } else {
      setErrorPassword("");
    }
    setPassword(inputValue);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-200">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <form onSubmit={handleSubmit} className="flex flex-col">
          <h2 className="text-3xl mb-6 text-center text-gray-800">Login</h2>
          <label className="mb-2 text-gray-700">
            Email:
            <input
              type="email"
              value={email}
              onChange={handleChangeEmail}
              className="p-2 border rounded w-full"
            />
            <small className="mb-4 text-red-500">{errorEmail}</small>
          </label>
          <label className="mb-4 text-gray-700">
            Contraseña:
            <input
              type="password"
              value={password}
              onChange={handleChangePassword}
              className="p-2 border rounded w-full"
            />
            <small className="mb-4 text-red-500">{errorPassword}</small>
          </label>
          <small className="mb-2 text-red-500">{errorLogin}</small>
          <button type="submit" className="p-2 bg-blue-500 text-white rounded">
            Login
          </button>
          <a
            href="/register"
            className="text-blue-500 hover:underline mt-4 text-center"
          >
            ¿No tienes una cuenta? Regístrate.
          </a>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
