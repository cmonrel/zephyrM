/**
 * @fileoverview Main application entry point.
 * @author [Carlos Monserrat Relaño]
 * @description Initializes and starts the application.
 * @module index
 * @version 1.0.0
 */

const path = require("path");

const express = require("express");
require("dotenv").config();
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const { dbConnection } = require("./database/config");
const { agenda } = require("./agenda/agenda");

// Create express server
const app = express();

// Create HTTP server and attach Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://localhost:8081",
      "exp://192.168.0.16:8081",
      "https://zephyrm.onrender.com",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  },
});

// Socket.IO connection handler
io.on("connection", (socket) => {
  console.log("A client connected");

  socket.on("register", (uid) => {
    console.log(`User registered to room: user-${uid}`);
    socket.join(`user-${uid}`);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Data base
dbConnection();

// EXPRESS CORS
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:8081",
      "exp://192.168.0.16:8081",
      "https://zephyrm.onrender.com",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "x-token"],
    credentials: true,
  })
);

// Directorio Público
app.use(express.static("public"));

// Parser and read body
app.use(express.json());

// Rutes
app.use("/api/auth", require("./auth/routes/auth"));

// CRUD: Events
app.use("/api/events", require("./modules/calendar/routes/events"));

// CRUD: Users
app.use("/api/users", require("./modules/users/routes/users"));

// CRUD: Assets
app.use("/api/assets", require("./modules/assetsModule/routes/assets"));

// CRUD: Notifications
app.use(
  "/api/notifications",
  require("./modules/notifications/routes/notifications")
);

// CRUD: Requests
app.use("/api/requests", require("./modules/requests/routes/requests"));

app.use("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

// Load and inject agenda jobs
require("./modules/notifications/helpers/sendNotifications")(agenda, io);

// Start agenda
agenda.on("ready", async () => {
  await agenda.start();
  console.log("Agenda started!");
});

// Start server
server.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
});
