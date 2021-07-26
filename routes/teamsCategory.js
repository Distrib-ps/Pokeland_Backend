const express = require("express");
const TeamsCategory = require("../models/TeamsCategory");

const router = express.Router();

const checkInput = (value, reg) => {
  if (!reg.test(value)) {
    throw new Error();
  }
};

router.get("/tiers/:id", async (req, res) => {
  try {
    const teamsCategory = await TeamsCategory.find({
      subTeamsGeneralTierId: req.params.id,
    });
    res.json(teamsCategory);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post("/add", async (req, res) => {
  const { name, subTeamsGeneralTierId } = req.body;

  try {
    checkInput(name, /[a-zA-z0-9]+/g);

    const newTeamsCategory = new TeamsCategory({
      name: name,
      subTeamsGeneralTierId: subTeamsGeneralTierId,
    });

    const teamsCategorySet = await newTeamsCategory.save();
    if (!teamsCategorySet) throw new Error();

    res.json(teamsCategorySet);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put("/update/:id", async (req, res) => {
  const { name } = req.body;
  const { id } = req.params;

  try {
    checkInput(name, /[a-zA-z0-9]+/g);

    await TeamsCategory.updateOne({ _id: id }, { name: name });

    const teamsCategory = await TeamsCategory.findById(id);

    res.json(teamsCategory);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    await TeamsCategory.deleteOne({ _id: req.params.id });

    res.status(200).json("delete");
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
