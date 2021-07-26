const express = require("express");
const fs = require("fs");
const upload = require("../upload");

const ForumPost = require("../models/ForumPost");

const router = express.Router();

const checkInput = (value, reg) => {
  if (!reg.test(value)) {
    throw new Error();
  }
};

router.get("/posts/:id", async (req, res) => {
  try {
    const forumPosts = await ForumPost.find({ topicId: req.params.id });
    res.json(forumPosts);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post("/add", async (req, res) => {
  const { topicId, description, userId } = req.body;

  const date = new Date();
  const localeDate = date.toLocaleDateString();
  const localTime = date.toLocaleTimeString();

  try {
    const forumPost = new ForumPost({
      topicId: topicId,
      description: description,
      userId: userId,
      date: `le ${localeDate} à ${localTime}`,
    });

    const newForumPost = await forumPost.save();

    res.json(newForumPost);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put("/update/:id", async (req, res) => {
  const { categoryId, description, userId } = req.body;
  const { id } = req.params;

  const date = new Date();
  const localeDate = date.toLocaleDateString();
  const localTime = date.toLocaleTimeString();

  try {
    await ForumPost.updateOne(
      { _id: id },
      {
        categoryId: categoryId,
        userId: userId,
        description: description,
        date: `le ${localeDate} à ${localTime}`,
      }
    );

    const forumPost = await ForumPost.findById(id);

    res.json(forumPost);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    await ForumPost.deleteOne({
      _id: req.params.id,
    });

    res.status(200).json("delete");
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
