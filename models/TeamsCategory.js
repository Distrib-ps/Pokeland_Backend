const mongoose = require("mongoose");

const teamsCategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  subTeamsGeneralTierId: { type: String, required: true },
});

module.exports = mongoose.model("TeamsCategory", teamsCategorySchema);
