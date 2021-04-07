const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: [
      "https://modaoriginal.vtexcommercestable.com.br",
      "http://localhost:3000",
    ],
    methods: ["GET", "POST"],
  },
});

server.listen("8080", () => console.log("Server run"));
let count = [];
let settings = {};

io.on("connection", (socket) => {
  count.push(socket?.id);
  socket.on("sendSku", (sku) => {
    settings = sku;
    console.log("sku :>> ", sku);
    socket.broadcast.emit("receivedSku", sku);
  });

  socket.broadcast.emit("init", settings);
});