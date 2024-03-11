import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";

const port = 3000;

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

const users = {};
 
io.on("connection", (socket) => {
  console.log("user Connected");
  console.log("ID", socket.id);

  socket.on("register", (userData) => {
    users[socket.id] = userData;
    console.log(`${userData.name} has joined the chat with ID ${socket.id}`);
    io.emit("userJoined", userData);
  });

  socket.on("message", (data) => {
    console.log(data, "backend data ");
    console.log(users, "users data");
    io.to(data.room).emit("receive", {
      message: data.message,
      id: data.id,
      sender: data.sender,
    });
  });

  socket.on("disconnect", () => {
    const disconnectedUser = users[socket.id];
    delete users[socket.id];
    console.log(
      `User Disconnected: ${
        disconnectedUser ? disconnectedUser.name : "Unknown"
      } (${socket.id})`
    );
  });
});

app.get("/", (req, res) => {
  res.send("hello world");
});

server.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
