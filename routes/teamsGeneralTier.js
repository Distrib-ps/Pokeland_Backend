const express = require("express");
const TeamsGeneralTier = require("../models/TeamsGeneralTier");

const router = express.Router();

const checkInput = (value, reg) => {
  if (!reg.test(value)) {
    throw new Error();
  }
};

router.get("/tiers", async (req, res) => {
  try {
    const teamsGeneralTiers = await TeamsGeneralTier.find();
    res.json(teamsGeneralTiers);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post("/add", async (req, res) => {
  const { name } = req.body;

  try {
    checkInput(name, /[a-zA-z0-9]+/g);

    const newTeamsGeneralTier = new TeamsGeneralTier({
      name: name,
    });

    const teamsGeneralTierSet = await newTeamsGeneralTier.save();
    if (!teamsGeneralTierSet) throw new Error();

    res.json(teamsGeneralTierSet);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put("/update/:id", async (req, res) => {
  const { name } = req.body;
  const { id } = req.params;

  try {
    checkInput(name, /[a-zA-z0-9]+/g);

    await TeamsGeneralTier.updateOne({ _id: id }, { name: name });

    const teamsGeneralTier = await TeamsGeneralTier.findById(id);

    res.json(teamsGeneralTier);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    await TeamsGeneralTier.deleteOne({ _id: req.params.id });

    res.status(200).json("delete");
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
