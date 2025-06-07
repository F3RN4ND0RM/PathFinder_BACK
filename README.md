# 🧭 Pathfinder - Backend

Este repositorio contiene el **backend** de **Pathfinder**, una API desarrollada con **Node.js** y **Express**. Se encarga de procesar la lógica del servidor, gestionar las rutas y comunicarse con el sistema de almacenamiento de datos.

## 🌐 Endpoints de la API

La API se encuentra diseñada para ser consumida por el frontend desplegado en Vercel:

🔗 [https://path-finder-front-kp9h09f65-fernands-projects-20aac045.vercel.app/](https://path-finder-front-kp9h09f65-fernands-projects-20aac045.vercel.app/)

## 🛠️ Tecnologías usadas

- ⚙️ **Node.js**
- 🚀 **Express**
- 🔒 **dotenv** para variables de entorno
- 🧪 **Nodemon** (modo desarrollo)

## 📁 Estructura del proyecto

```
/
├── src/
│   ├── controllers/     # Lógica de cada endpoint
│   ├── routes/          # Definición de rutas
│   ├── models/          # Modelos (si usas BD)
│   ├── middlewares/     # Middlwares
│   ├── public/          # Public static page
│   ├── db/              # conexión a base de datos
│   └── app.js           # Configuración principal de Express
├── .env                 # Variables de entorno
├── .gitignore
├── package.json
└── app.js            # Entrada principal del servidor
```

## ⚙️ Instalación y desarrollo local

1. Clona el repositorio:

```bash
git clone https://github.com/F3RN4ND0RM/PathFinder_BACK.git
cd pathfinder-backend
```

2. Instala las dependencias:

```bash
npm install
```

3. Crea un archivo `.env` con las variables necesarias:

```env
PORT=TU PUERTO
DBURL= URL SUPABASE
SMTP_USER= USER
SMTP_PASS= PASS
SMTP_PORT= PORT
SMTP_HOST= HOST
SECRET= JWT SECRET
OAIKEY= OPEN AI KEY
```

4. Inicia el servidor en modo desarrollo:

```bash
nodemon app.js
```

Abre `http://localhost:PORT` para ver el backend corriendo.

## 🚢 Despliegue

Puedes desplegar este backend en cualquier plataforma como **Render**, **Railway**, **Vercel (Serverless)** o **Heroku**, apuntando las variables de entorno necesarias.

## 📄 Licencia

Este proyecto es privado y su uso está restringido a colaboradores autorizados.

## 🤝 Contribuciones

Este repositorio es **privado**. Si formas parte del equipo, asegúrate de trabajar desde ramas independientes y realizar pull requests bien documentados.
