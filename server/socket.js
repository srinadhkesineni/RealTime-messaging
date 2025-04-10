const Room = require("./models/room");
const Message = require("./models/messages");
const User = require("./models/user");

const connectedUsers = {}; // socketId -> roomName

module.exports = function (io) {
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Emit current rooms
    socket.on("get_active_rooms", async () => {
      try {
        const rooms = await Room.find({});
        const roomNames = rooms.map((room) => room.roomName);
        socket.emit("active_rooms", roomNames);
      } catch (err) {
        console.error("Error fetching active rooms:", err);
      }
    });

    // Create room
    socket.on("create_room", async (roomName) => {
      try {
        const exists = await Room.findOne({ roomName });
        if (!exists) {
          await Room.create({ roomName });
          io.emit("room_created", roomName);
          console.log(`Room created: ${roomName}`);
        } else {
          socket.emit("room_error", "Room already exists.");
        }
      } catch (err) {
        console.error("Error creating room:", err);
      }
    });

    // Join room
    socket.on("join_room", async (roomName) => {
      try {
        const room = await Room.findOne({ roomName });
        if (room) {
          socket.join(roomName);
          connectedUsers[socket.id] = roomName;
          console.log(`User ${socket.id} joined ${roomName}`);
        } else {
          socket.emit("room_error", "Room does not exist.");
        }
      } catch (err) {
        console.error("Error joining room:", err);
      }
    });

    // Disconnect

    socket.on("send_message", async (data) => {
      try {
        const { room, userId, message } = data;
        console.log(room);
        // Find Room by name
        const roomDoc = await Room.findOne({ roomName: room });
        if (!roomDoc) {
          console.log("Room not found:", room);
          return socket.emit("room_error", "Room not found.");
        }

        // Find User by ID
        const userDoc = await User.findOne({ email: userId });
        if (!userDoc) {
          return socket.emit("user_error", "User not found.");
        }

        // Save Message
        const newMessage = new Message({
          roomId: roomDoc._id,
          senderId: userDoc._id,
          text: message,
        });

        await newMessage.save();

        // Emit Message to room
        io.to(room).emit("receive_message", {
          text: newMessage.text,
          sender: userDoc.email,
          timestamp: newMessage.timestamp,
        });
      } catch (err) {
        console.error("Error saving message:", err);
      }
    });

    // Load previous messages
    socket.on("get_messages", async (roomName) => {
      try {
        const room = await Room.findOne({ roomName });
        if (!room) return;

        const messages = await Message.find({ roomId: room._id })
          .populate("senderId", "email")
          .sort({ timestamp: 1 });
        socket.emit("previous_messages", messages);
      } catch (err) {
        console.error("Error getting messages:", err);
      }
    });

    socket.on("disconnect", async () => {
      const roomName = connectedUsers[socket.id];
      delete connectedUsers[socket.id];

      if (roomName) {
        try {
          // Check if any users are still in the room
          const roomSockets = await io.in(roomName).fetchSockets();

          if (roomSockets.length === 0) {
            await Room.deleteOne({ roomName });
            io.emit("room_deleted", roomName);
            console.log(`Room ${roomName} deleted (empty).`);
          }
        } catch (err) {
          console.error("Error handling disconnect:", err);
        }
      }

      console.log(`User disconnected: ${socket.id}`);
    });
  });
};
