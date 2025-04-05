const Room = require("./models/room");

function socketHandler(io) {
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("join_room", async (roomName) => {
      socket.join(roomName);
      console.log(`User with ID ${socket.id} joined room: ${roomName}`);

      try {
        const exists = await Room.findOne({ name: roomName });
        if (!exists) {
          await Room.create({ name: roomName });
        }
      } catch (err) {
        console.error("Error joining room:", err);
      }
    });

    socket.on("send_message", (data) => {
      socket.to(data.room).emit("receive_message", data);
    });

    socket.on("leave_room", async (roomName) => {
      socket.leave(roomName);
      console.log(`User with ID ${socket.id} left room: ${roomName}`);

      const socketsInRoom = await io.in(roomName).fetchSockets();
      if (socketsInRoom.length === 0) {
        await Room.deleteOne({ name: roomName });
        console.log(`Room ${roomName} deleted from DB`);
      }
    });

    socket.on("disconnecting", async () => {
      const rooms = Array.from(socket.rooms).filter((r) => r !== socket.id);
      for (const room of rooms) {
        const sockets = await io.in(room).fetchSockets();
        if (sockets.length <= 1) {
          await Room.deleteOne({ name: room });
          console.log(`Room ${room} deleted on disconnect`);
        }
      }
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
}

module.exports = socketHandler;
