const express = require("express");
const SubTeamsGeneralTier = require("../models/SubTeamsGeneralTier");

const router = express.Router();

const checkInput = (value, reg) => {
  if (!reg.test(value)) {
    throw new Error();
  }
};

router.get("/tiers/:id", async (req, res) => {
  try {
    const subTeamsGeneralTiers = await SubTeamsGeneralTier.find({
      teamsGeneralTierId: req.params.id,
    });
    res.json(subTeamsGeneralTiers);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post("/add", async (req, res) => {
  const { name, teamsGeneralTierId } = req.body;

  try {
    checkInput(name, /[a-zA-z0-9]+/g);

    const newSubTeamsGeneralTier = new SubTeamsGeneralTier({
      name: name,
      teamsGeneralTierId: teamsGeneralTierId,
    });

    const subTeamsGeneralTierSet = await newSubTeamsGeneralTier.save();
    if (!subTeamsGeneralTierSet) throw new Error();

    res.json(subTeamsGeneralTierSet);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put("/update/:id", async (req, res) => {
  const { name } = req.body;
  const { id } = req.params;

  try {
    checkInput(name, /[a-zA-z0-9]+/g);

    await SubTeamsGeneralTier.updateOne({ _id: id }, { name: name });

    const subTeamsGeneralTier = await SubTeamsGeneralTier.findById(id);

    res.json(subTeamsGeneralTier);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    await SubTeamsGeneralTier.deleteOne({ _id: req.params.id });

    res.status(200).json("delete");
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
