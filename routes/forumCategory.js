const express = require("express");
const ForumCategory = require("../models/ForumCategory");

const router = express.Router();

const checkInput = (value, reg) => {
  if (!reg.test(value)) {
    throw new Error();
  }
};

router.get("/categories", async (req, res) => {
  try {
    const forumCategory = await ForumCategory.find();
    res.json(forumCategory);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post("/add", async (req, res) => {
  const { name } = req.body;

  try {
    checkInput(name, /[a-zA-z0-9]+/g);

    const newForumCategory = new ForumCategory({
      name: name,
    });

    const forumCategorySet = await newForumCategory.save();
    if (!forumCategorySet) throw new Error();

    res.json(forumCategorySet);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put("/update/:id", async (req, res) => {
  const { name } = req.body;
  const { id } = req.params;

  try {
    checkInput(name, /[a-zA-z0-9]+/g);

    await ForumCategory.updateOne({ _id: id }, { name: name });

    const forumCategory = await ForumCategory.findById(id);

    res.json(forumCategory);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    await ForumCategory.deleteOne({ _id: req.params.id });

    res.status(200).json("delete");
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
