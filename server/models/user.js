const { model, Schema } = require("mongoose");

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, "username is required"],
    unique: [true, "username should be unique"],
  },
  email: {
    type: String,
    required: [true, "email is required"],
    unique: [true, "email should be unique"],
  },
  password: {
    type: String,
    required: [true, "passwprd is required"],
    unique: [true, "password should be unique"],
  },
});


module.exports = model("User", userSchema)