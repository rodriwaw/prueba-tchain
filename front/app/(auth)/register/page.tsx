"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignUp() {
  const router = useRouter();
  if (typeof window !== 'undefined' &&localStorage.getItem("token")) {
    router.push("/dashboard");
  }

  const [data, setData] = useState({
    name: "",
    lastname: "",
    email: "",
    password: "",
  });
  const [errorPassword, setErrorPassword] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [errorRegister, setErrorRegister] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

  const onChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    //validate the password
    setErrorRegister("");

    if (name === "password" && !passwordRegex.test(value) && value.length > 0) {
      setErrorPassword(
        "La contraseña debe contener al menos 8 caracteres, una letra mayúscula, una letra minúscula y un número."
      );
    } else if (name === "password" && value.length === 0) {
      setErrorPassword("El campo no puede estar vacío.");
    } else if (name === "password") {
      setErrorPassword("");
    }

    //validate email
    if (name === "email" && !emailRegex.test(value) && value.length > 0) {
      setErrorEmail("El correo no es válido.");
    } else if (name === "email" && value.length === 0) {
      setErrorEmail("El campo no puede estar vacío.");
    } else if (name === "email") {
      setErrorEmail("");
    }

    setData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      //validate if the fields are empty
      if (
        data.email.length === 0 &&
        data.password.length === 0 &&
        data.name.length === 0 &&
        data.lastname.length === 0
      ) {
        setErrorRegister("Todos los campos son obligatorios.");
        return;
      } else setErrorRegister("");

      //make the request to the server
      const response = await fetch(
        //use dotenv to get the url
        `http://${process.env.NEXT_PUBLIC_HOST}:${process.env.NEXT_PUBLIC_PORT}/register`,
        {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      const dataResponse = await response.json();
      if (dataResponse.success) {
        alert("Usuario creado correctamente.");
        router.push("/login");
      } else setErrorRegister(dataResponse.message);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-200">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <h2 className="text-3xl mb-6 text-center text-gray-800">
            Crear cuenta
          </h2>
          <label className="mb-2 text-gray-700">
            Nombre:
            <input
              type="text"
              name="name"
              value={data.name}
              onChange={onChange}
              className=" p-2 border rounded w-full"
            />
            <small className="mb-3 text-red-500">{}</small>
          </label>

          <label className="mb-2 text-gray-700">
            Apellidos:
            <input
              type="text"
              name="lastname"
              value={data.lastname}
              onChange={onChange}
              className=" p-2 border rounded w-full"
            />
            <small className="mb-3 text-red-500">{}</small>
          </label>

          <label className="mb-2 text-gray-700">
            Email:
            <input
              type="email"
              name="email"
              value={data.email}
              onChange={onChange}
              className=" p-2 border rounded w-full"
            />
            <small className="mb-1 text-red-500">{errorEmail}</small>
          </label>

          <label className="mb-2 text-gray-700">
            Contraseña:
            <input
              type="password"
              name="password"
              value={data.password}
              onChange={onChange}
              className="p-2 border rounded w-full"
            />
            <small className="mb-4 text-red-500">{errorPassword}</small>
          </label>
          <small className="mb-2 text-red-500">{errorRegister}</small>

          <button className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
            Crear cuenta
          </button>
          <div className="text-center">
            <a
              href="/login"
              className="text-blue-500 hover:underline mt-2 block"
            >
              ¿Ya tienes una cuenta? Inicia sesión.
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
