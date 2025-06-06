# ZephyrM

**ZephyrM** es una plataforma para la gestión de activos físicos que permite registrar, consultar y asignar activos tanto desde una aplicación web como desde una aplicación móvil. El sistema incluye funciones de autenticación, notificaciones en tiempo real, gestión de eventos y escaneo mediante tecnología NFC.

## 📁 Estructura del Repositorio

```
zephyrM/
├── zephyrm-backend         # API REST con Node.js + Express + MongoDB
├── zephyrm-frontend        # Interfaz web (React + Redux Toolkit)
└── zephyrm-mobile-expo     # Aplicación móvil (React Native + Expo)
```

---

## 🌐 Tecnologías

- **Frontend Web**:
  - React + Redux Toolkit
  - Axios, React Big Calendar, React Datepicker
  - JWT authentication
  - Socket.io para notificaciones en tiempo real

- **Frontend Móvil**:
  - React Native con Expo
  - Escaneo de etiquetas NFC
  - Axios + Socket.io-client
  - Compartición de backend con la web

- **Backend**:
  - Node.js + Express
  - MongoDB (Mongoose)
  - JWT para autenticación
  - Agenda para tareas programadas
  - ExcelJS para exportación
  - WebSockets con Socket.io

---

## 🚀 Despliegue

Este proyecto está desplegado en [[Render](https://zephyrm.onrender.com)], tanto para el backend como para el frontend web. La app móvil se ejecuta desde Expo.

---

## 🧪 Ejecución local

### Requisitos:
- Node.js
- MongoDB
- Expo CLI (para la app móvil)

### Backend
```bash
cd zephyrm-backend
npm install
npm run dev
```

### Frontend Web
```bash
cd zephyrm-frontend
npm install
npm run dev
```

### Frontend Móvil
```bash
cd zephyrm-mobile-expo
npm install
npx expo start
```

---

## 📝 Documentación

Toda la documentación de este proyecto está disponible en la memoria del Trabajo de Fin de Grado. El código ha sido documentado en inglés para facilitar su comprensión y mantenimiento internacional. Puedes consultar los detalles técnicos y manuales de usuario en los archivos del repositorio o accediendo a la [wiki del proyecto](https://github.com/cmonrel/zephyrM/wiki) (si aplica).

---

## 📄 Licencia

Este proyecto ha sido desarrollado como parte de un Trabajo de Fin de Grado. Todos los derechos reservados.

---

## ⚙️ Configuración de variables de entorno

Para que el sistema funcione correctamente, es necesario configurar las variables de entorno en el archivo `.env` del backend.

Ejemplo de archivo `.env`:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/zephyrm
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=http://localhost:3000
```

Asegúrate de que los valores se ajustan a tu entorno de desarrollo local o de producción.

- `PORT`: Puerto en el que se ejecuta el servidor backend.
- `MONGO_URI`: URI de conexión a la base de datos MongoDB.
- `JWT_SECRET`: Clave secreta para generar y validar los tokens JWT.
- `FRONTEND_URL`: URL del frontend permitida para CORS.



---

## ⚙️ Configuración de variables de entorno

### 📦 Backend (`zephyrm-backend`)

1. Copia el archivo `.env.template`, renómbralo a `.env` y ajústalo según tu configuración:

```bash
cp .env.template .env
```

2. Luego, edita el archivo `.env` con valores similares a los siguientes:

```env
PORT=TU_PUERTO
DB_CN=URI_TU_BASE_DATOS_DE_MONGODB
SECRET_JWT_SEED=TU_SEMILLA_PARA_ENCRIPTAR
```

---

### 🌐 Frontend Web (`zephyrm-frontend`)

1. Copia el archivo `.env.template`, renómbralo a `.env`:

```bash
cp .env.template .env
```

2. Luego, edita el archivo `.env` con los siguientes valores:

```env
VITE_WEBSOCKET_URL=URL_SERVIDOR
VITE_API_URL=URL_SERVIDOR/api
```

---

### 📱 Frontend Móvil (`zephyrm-mobile-expo`)

1. Copia el archivo `.env.template`, renómbralo a `.env`:

```bash
cp .env.template .env
```

2. Luego, edita el archivo `.env` con los siguientes valores:

```env
EXPO_PUBLIC_RELOAD_TIME=TIEMPO_RECARGA_USEFOCUSEFFECT
EXPO_PUBLIC_WEBSOCKET_URL=URL_SERVIDOR
EXPO_PUBLIC_API_URL=URL_SERVIDOR/api
```
