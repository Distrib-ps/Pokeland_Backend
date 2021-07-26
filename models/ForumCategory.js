const mongoose = require("mongoose");

const forumCategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
});

module.exports = mongoose.model("forumCategory", forumCategorySchema);
