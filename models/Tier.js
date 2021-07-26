const mongoose = require("mongoose");

const tiersSchema = new mongoose.Schema({
  date: { type: String, required: true },
  name: { type: String, required: true },
});

module.exports = mongoose.model("Tiers", tiersSchema);
