const { model, Schema } = require("mongoose");
const User = require("./user");

const roomSchema = new Schema({
  roomName: {
    type: String,
    required: [true, "room name is required"],
    unique: [true, "room name should be unique"],
  },
  users: [{ type: Schema.Types.ObjectId, ref: "User" }],
  messages: [
    {
      sender: { type: Schema.Types.ObjectId, ref: "User" },
      text: {
        type: String,
        required: true,
        timestamp: { type: Date, default: Date.now },
      },
    },
  ],
});

module.exports = model("Room", roomSchema);
