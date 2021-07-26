const mongoose = require("mongoose");

const subTeamsGeneralTierSchema = new mongoose.Schema({
  name: { type: String, required: true },
  teamsGeneralTierId: { type: String, required: true },
});

module.exports = mongoose.model(
  "SubTeamsGeneralTier",
  subTeamsGeneralTierSchema
);
