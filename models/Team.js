const mongoose = require("mongoose");

const teamsSchema = new mongoose.Schema({
  date: { type: String, required: true },
  title: { type: String, required: true },
  categoryName: { type: String, required: true },
  categoryId: { type: String, required: true },
  link: { type: String, required: true },
  description: { type: String, required: true },
  idPokepast: { type: String, required: true },
});

module.exports = mongoose.model("Team", teamsSchema);
