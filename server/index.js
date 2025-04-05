const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const { connectToMongo } = require("./database/connectDB.js");
const userRoute = require("./routes/userRoute.js")
const messageRoute = require("./routes/messageRoute.js")
const roomRoute = require("./routes/roomRoute.js")
const socketHandler = require("./socket.js")

app.use(cors());
app.use(express.json())

connectToMongo();

app.use(userRoute)
app.use(messageRoute)
app.use(roomRoute)

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

socketHandler(io);


server.listen(3001, () => {
  console.log("server listening on port 3001");
});
