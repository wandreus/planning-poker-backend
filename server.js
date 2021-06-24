const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

server.listen("8080", () => console.log("Server run"));
let settings = {};
let allmessages = [];

io.on("connection", (socket) => {
  // default settings initial
  socket.broadcast.emit("init", { settings, allmessages });

  // Chat
  socket.on("logeed", (name) => {
    const message = { Textmessages: "Entrou", name, entry: true };
    allmessages.push(message);
    socket.broadcast.emit("updateMessages", message);
  });

  socket.on("SendMessage", (el) => {
    allmessages.push(el);
    socket.broadcast.emit("updateMessages", el);
  });

  // Product
  socket.on("sendSku", (sku) => {
    settings = sku;
    socket.broadcast.emit("receivedSku", sku);
  });
});
