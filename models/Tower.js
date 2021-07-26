const mongoose = require("mongoose");

const towerSchema = new mongoose.Schema({
  date: { type: String, required: true },
  title: { type: String, required: true },
  picture: { type: String },
  description: { type: String, required: true },
});

module.exports = mongoose.model("Tower", towerSchema);
