const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  pseudo: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String },
  profilePicture: { type: String },
  role: { type: String },
  token: { type: String },
});

module.exports = mongoose.model("User", userSchema);
