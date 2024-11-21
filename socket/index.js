require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io");
const http = require("http");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

let onlineUser = [];

io.on("connection", (socket) => {
  console.log("New client connected: " + socket.id);

  socket.on("addUser", (userId) => {
    onlineUser.push({
      userId,
      socketId: socket.id,
    });

    console.log("online user:", onlineUser);

    io.emit("getOnlineUsers", onlineUser);
  });

  //typing
  socket.on("typing", (data) => {
    //recipient
    const user = onlineUser.find((user) => user.userId === data.recipientId);

    if (user) {
      io.to(user.socketId).emit("displayTyping", {
        typing: true,
        senderId: data.senderId,
      });
    }
  });

  //stop typing
  socket.on("stopTyping", (data) => {
    //recipient
    const user = onlineUser.find((user) => user.userId === data.recipientId);

    if (user) {
      io.to(user.socketId).emit("displayTyping", { typing: false });
    }
  });

  //send message
  socket.on("sendMessage", (message) => {
    const user = onlineUser.find((user) => user.userId === message.recipientId);

    if (user) {
      io.to(user.socketId).emit("getMessage", message);
      io.to(user.socketId).emit("getNotification", {
        senderId: message.senderId,
        isRead: false,
        date: new Date(),
      });
    }
  });

  socket.on("disconnect", () => {
    onlineUser = onlineUser.filter((user) => user.socketId !== socket.id);

    io.emit("getOnlineUsers", onlineUser);
    console.log("Client disconnected: " + socket.id);
  });
});

const port = process.env.PORT || 8080;

server.listen(port, () => {
  console.log("listen to port :" + port);
});
