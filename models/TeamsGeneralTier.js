const mongoose = require("mongoose");

const teamsGeneralTierSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

module.exports = mongoose.model("TeamsGeneralTier", teamsGeneralTierSchema);
