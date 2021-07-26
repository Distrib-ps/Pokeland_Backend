const mongoose = require("mongoose");

const forumPostSchema = new mongoose.Schema({
  date: { type: String, required: true },
  topicId: { type: String, required: true },
  description: { type: String, required: true },
  userId: { type: String, required: true },
});

module.exports = mongoose.model("ForumPost", forumPostSchema);
