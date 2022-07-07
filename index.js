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
let showVoting = false;

io.on("connection", (socket) => {
  socket.emit("init", { voting, users, showVoting });

  socket.on("logeed", (user) => {
    const newUser = users.filter((u) => u?.user?.email !== user?.user?.email);

    const newList = [...newUser, user].sort((a, b) => {
      const aName = a?.user?.name;
      const bName = b?.user?.name;
      return aName < bName ? -1 : aName > bName ? 1 : 0;
    });

    if (user) users = newList;

    io.emit("Users", { users });
  });

  socket.on("voting", (vot) => {
    const newVoting = voting.filter((u) => u?.user?.email !== vot?.user?.email);
    if (vot) voting = [...newVoting, vot];
    io.emit("AllVoting", { voting });
  });

  socket.on("show", (show) => {
    showVoting = show;
    io.emit("showVoting", { showVoting });
  });

  socket.on("reset", () => {
    voting = [];
    io.emit("AllVoting", { voting });
  });
});
