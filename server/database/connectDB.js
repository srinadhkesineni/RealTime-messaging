const mongoose = require("mongoose");

const connectToMongo = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/real-time-messaging");

    console.log("mongodb connection successfull!!");
  } catch (err) {
    console.log("mongodb connection failed", err);
  }
};

module.exports = { connectToMongo };
