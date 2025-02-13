CREATE DATABASE tchain_db;
CREATE USER tchain_user WITH PASSWORD 'tchain_password';
GRANT ALL PRIVILEGES ON DATABASE tchain_db TO tchain_user;

\c tchain_db;

CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellidos VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE,
    contrasena VARCHAR(100) NOT NULL,
    eliminado BOOLEAN DEFAULT FALSE
);