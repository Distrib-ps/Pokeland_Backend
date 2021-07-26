const express = require("express");
const fs = require("fs");
const upload = require("../upload");

const ForumTopic = require("../models/ForumTopic");

const router = express.Router();

const checkInput = (value, reg) => {
  if (!reg.test(value)) {
    throw new Error();
  }
};

router.get("/topic/:id", async (req, res) => {
  try {
    const forumTopics = await ForumTopic.find({ categoryId: req.params.id });
    res.json(forumTopics);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.get("/all", async (req, res) => {
  try {
    const forumTopics = await ForumTopic.find();
    res.json(forumTopics);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post("/add", async (req, res) => {
  const { title, categoryName, categoryId, description, userId } = req.body;

  const date = new Date();
  const localeDate = date.toLocaleDateString();
  const localTime = date.toLocaleTimeString();

  try {
    const forumTopic = new ForumTopic({
      title: title,
      categoryName: categoryName,
      categoryId: categoryId,
      description: description,
      userId: userId,
      date: `le ${localeDate} à ${localTime}`,
    });

    const newForumTopic = await forumTopic.save();

    res.json(newForumTopic);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put("/update/:id", async (req, res) => {
  const { title, categoryName, categoryId, description, userId } = req.body;
  const { id } = req.params;

  const date = new Date();
  const localeDate = date.toLocaleDateString();
  const localTime = date.toLocaleTimeString();

  try {
    await ForumTopic.updateOne(
      { _id: id },
      {
        title: title,
        categoryName: categoryName,
        categoryId: categoryId,
        userId: userId,
        description: description,
        date: `le ${localeDate} à ${localTime}`,
      }
    );

    const forumTopic = await ForumTopic.findById(id);

    res.json(forumTopic);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    await ForumTopic.deleteOne({
      _id: req.params.id,
    });

    res.status(200).json("delete");
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
