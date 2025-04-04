const express = require("mongoose");
const Message = require("../models/messages");
const Room = require("../models/room");
const User = require("../models/user");

const router = express.Router();

router.post("/send", async (req, res) => {
  try {
    const { roomId, senderId, text } = req.body;
    if (!roomId || !senderId || !text) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const message = await Message.create({ roomId, senderId, text });
    await Room.findByIdAndUpdate(roomId, { $push: { messages: message._id } });
    res.status(201).json(message);
  } catch (err) {
    console.log(err);
  }
});

router.get("/:room", async (req, res) => {
  try {
    const { roomId } = req.params;
    const messages = Message.find({ roomId }).populate(
      "senderId",
      "username email"
    );
    res.status(201).json(messages);
  } catch (err) {
    console.log(err);
  }
});

router.delete("/delete/:roomId", async (req, res) => {
  try {
    const { roomId } = req.params;

    await Message.deleteMany({ roomId });

    res.status(200).json({ message: "Messages deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
