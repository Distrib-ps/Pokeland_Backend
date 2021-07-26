const mongoose = require("mongoose");

const ForumTopicSchema = new mongoose.Schema({
  date: { type: String, required: true },
  title: { type: String, required: true },
  categoryName: { type: String, required: true },
  categoryId: { type: String, required: true },
  description: { type: String, required: true },
  userId: { type: String, required: true },
});

module.exports = mongoose.model("ForumTopic", ForumTopicSchema);
