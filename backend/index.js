// Library

const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const { addUsers, removeUser, getUser, getUserInRoom } = require("./entity");

//Instances

const app = express();
const server = http.createServer(app);
const io = socketio(server, { cors: { origin: "*" } });

//End Point

app.get("/", (req, res) => {
  res.json("Api is Working");
});

//Socket

io.on("connect", (socket) => {
  console.log("User Connected");

  socket.on("join", ({ name, room }, callBack) => {
    const { user, error } = addUsers({ id: socket.id, name: name, room: room });

    if (error) {
      callBack(error);
      return;
    }

    socket.join(user.room);

    socket.emit("message", { user: "admin", text: `Welcome ${user.name} ` });

    socket.broadcast
      .to(user.room)
      .emit("message", { user: "admin", text: `${user.name} has joined` });

    io.to(user.room).emit("activeUsers", getUserInRoom(user.room));
  });

  socket.on("sendMsg", (message, callBack) => {
    const user = getUser(socket.id);

    if (user) {
      io.to(user.room).emit("message", {
        user: user.name,
        text: message,
        id: user.id,
      });
      callBack("");
    } else {
      callBack("User Not Found");
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit("message", {
        user: "admin",
        text: `${user.name} has left`,
      });
      io.to(user.room).emit("activeUsers", getUserInRoom(user.room));
    }
  });
});

//Run Server

server.listen(8000, () => {
  console.log(`listening ${8000} port `);
});
