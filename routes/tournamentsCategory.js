const express = require("express");
const TournamentsCategory = require("../models/TournamentsCategory");

const router = express.Router();

const checkInput = (value, reg) => {
  if (!reg.test(value)) {
    throw new Error();
  }
};

router.get("/tournaments/", async (req, res) => {
  try {
    const tournamentsCategory = await TournamentsCategory.find();
    res.json(tournamentsCategory);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post("/add", async (req, res) => {
  const { name } = req.body;

  try {
    checkInput(name, /[a-zA-z0-9]+/g);

    const newTournamentsCategory = new TournamentsCategory({
      name: name,
    });

    const tournamentsCategorySet = await newTournamentsCategory.save();
    if (!tournamentsCategorySet) throw new Error();

    res.json(tournamentsCategorySet);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put("/update/:id", async (req, res) => {
  const { name } = req.body;
  const { id } = req.params;

  try {
    checkInput(name, /[a-zA-z0-9]+/g);

    await TournamentsCategory.updateOne({ _id: id }, { name: name });

    const tournamentsCategory = await TournamentsCategory.findById(id);

    res.json(tournamentsCategory);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    await TournamentsCategory.deleteOne({ _id: req.params.id });

    res.status(200).json("delete");
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
