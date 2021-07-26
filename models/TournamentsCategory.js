const mongoose = require("mongoose");

const tournamentsCategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
});

module.exports = mongoose.model(
  "TournamentsCategory",
  tournamentsCategorySchema
);
