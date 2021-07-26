const mongoose = require("mongoose");

const tournamentsSchema = new mongoose.Schema({
  date: { type: String, required: true },
  title: { type: String, required: true },
  categoryName: { type: String, required: true },
  categoryId: { type: String, required: true },
  picture: { type: String },
  description: { type: String, required: true },
});

module.exports = mongoose.model("Tournament", tournamentsSchema);
