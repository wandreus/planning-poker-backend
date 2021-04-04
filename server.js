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

io.on("connection", (socket) => {
  socket.on("sendSku", (sku) => {
    console.log("sku :>> ", sku);
    socket.broadcast.emit("receivedSku", sku);
  });
});
