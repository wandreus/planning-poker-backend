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

let voting = [];
let users = [];

io.on("connection", (socket) => {
  socket.emit("init", { voting, users });

  socket.on("logeed", (user) => {
    const newUser = users.filter((u) => u?.user?.email !== user?.user?.email);

    const newList = [...newUser, user].sort((a, b) => {
      return a?.user?.name < b?.user?.name
        ? -1
        : a?.user?.name > b?.user?.name
        ? 1
        : 0;
    });

    if (user) users = newList;

    io.emit("Users", { users });
  });

  socket.on("voting", (vot) => {
    const newVoting = voting.filter((u) => u?.user?.email !== vot?.user?.email);
    if (vot) voting = [...newVoting, vot];
    io.emit("AllVoting", { voting });
  });
});
