const express = require("express");
const fs = require("fs");
const upload = require("../upload");

const Tournament = require("../models/Tournament");

const router = express.Router();

const checkInput = (value, reg) => {
  if (!reg.test(value)) {
    throw new Error();
  }
};

router.get("/tournaments/:id", async (req, res) => {
  try {
    const tournaments = await Tournament.find({ categoryId: req.params.id });
    res.json(tournaments);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.get("/all", async (req, res) => {
  try {
    const tournaments = await Tournament.find();
    res.json(tournaments);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post("/add", upload.single("picture"), async (req, res) => {
  const { title, categoryName, categoryId, description } = req.body;

  const date = new Date();
  const localeDate = date.toLocaleDateString();
  const localTime = date.toLocaleTimeString();

  try {
    let tournament;
    if (req.file) {
      tournament = new Tournament({
        title: title,
        categoryName: categoryName,
        categoryId: categoryId,
        description,
        picture: req.file.filename,
        date: `le ${localeDate} à ${localTime}`,
      });
    } else {
      tournament = new Tournament({
        title: title,
        categoryName: categoryName,
        categoryId: categoryId,
        description,
        date: `le ${localeDate} à ${localTime}`,
      });
    }

    const newTournament = await tournament.save();

    res.json(newTournament);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put("/update/:id", upload.single("picture"), async (req, res) => {
  const { title, categoryName, categoryId, description } = req.body;
  const { id } = req.params;

  const date = new Date();
  const localeDate = date.toLocaleDateString();
  const localTime = date.toLocaleTimeString();

  try {
    const tournamentToUpdate = await Tournament.findById(id);

    if (req.file) {
      fs.unlink(`./uploads/${tournamentToUpdate.picture}`, function (err) {
        if (err) throw new Error();
      });
    }

    await Tournament.updateOne(
      { _id: id },
      {
        title: title,
        categoryName: categoryName,
        categoryId: categoryId,
        picture: req.file.filename,
        description: description,
        date: `le ${localeDate} à ${localTime}`,
      }
    );

    const tournament = await Tournament.findById(id);

    res.json(tournament);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const tournament = await Tournament.findById(id);

    if (tournament.picture && !tournament.picture.includes("http")) {
      fs.unlink(`./uploads/${tournament.picture}`, function (err) {
        if (err) throw new Error();
      });
    }

    await Tournament.deleteOne({
      _id: id,
    });

    res.status(200).json("delete");
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
