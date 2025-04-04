const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const { connectToMongo } = require("./database/connectDB.js");
const userRoute = require("./routes/userRoute.js")
const messageRoute = require("./routes/messageRoute.js")
const roomRoute = require("./routes/roomRoute.js")

app.use(cors());

connectToMongo();

app.use(userRoute)
app.use(messageRoute)
app.use(roomRoute)

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log(`user connected ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID ${socket.id} joined room:${data}`);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("user disconencted", socket.id);
  });
});

server.listen(3001, () => {
  console.log("server listening on port 3001");
});
