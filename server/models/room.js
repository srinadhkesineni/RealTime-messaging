const { model, models, Schema } = require("mongoose");

const roomSchema = new Schema({
  roomName: {
    type: String,
    required: [true, "room name is required"],
    unique: [true, "room name should be unique"],
  },
  users: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

module.exports = models.Room || model("Room", roomSchema);
