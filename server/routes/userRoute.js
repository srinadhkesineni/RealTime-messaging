const express = require("mongoose");
const Message = require("../models/messages");
const Room = require("../models/room");
const User = require("../models/user");

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "all fields required" });
    }
    const user = await User.create({ username, email, password });
    res.status(201).json(user);
  } catch (err) {
    console.log(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "invalid email" });
    }
    if (user.password !== password) {
      return res.status(400).json({ message: "invalid password" });
    }
    res.status(200).json("successful");
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
