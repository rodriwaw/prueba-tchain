# prueba-tchain

Prueba técnica TChain

## Cómo correr ambos proyectos

Asegúrate de tener PostgreSQL instalado. En el archivo `init.sql` se encuentra la estructura de la base de datos utilizada en este proyecto.

### Backend

1. Navega al directorio del backend:
   ```sh
   cd /ruta/al/backend
   ```
2. Instala las dependencias:
   ```sh
   npm  install
   ```
3. Inicia el servidor:
   ```sh
   npm run start:prod
   ```

### Frontend

1. Navega al directorio del frontend:
   ```sh
   cd /ruta/al/frontend
   ```
2. Instala las dependencias:
   ```sh
   npm  install
   ```
3. Inicia la aplicación:
   ```sh
   npm run start:prod
   ```

### Usando Docker Compose

1. Asegúrate de tener Docker y Docker Compose instalados en tu máquina.
2. Navega al directorio raíz del proyecto donde se encuentra el archivo `docker-compose.yml`:
   ```sh
   cd /ruta/al/proyecto
   ```
3. Construye y levanta los contenedores:
   ```sh
   docker-compose up --build
   ```
4. Accede a la aplicación en tu navegador en la URL correspondiente (por defecto, `http://localhost:3000` para el frontend y `http://localhost:3333` para el backend).

Para detener y eliminar los contenedores, ejecuta:
`sh
    docker-compose down
    `
