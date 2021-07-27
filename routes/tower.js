const express = require("express");
const fs = require("fs");
const upload = require("../upload");

const Tower = require("../models/Tower");

const router = express.Router();

router.get("/towers", async (req, res) => {
  try {
    const towers = await Tower.find();
    res.json(towers);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post("/add", upload.single("picture"), async (req, res) => {
  const { title, description } = req.body;

  const date = new Date();
  const localeDate = date.toLocaleDateString();
  const localTime = date.toLocaleTimeString();

  try {
    let tower;
    if (req.file) {
      tower = new Tower({
        title: title,
        description,
        picture: req.file.filename,
        date: `le ${localeDate} à ${localTime}`,
      });
    } else {
      tower = new Tower({
        title: title,
        description,
        date: `le ${localeDate} à ${localTime}`,
      });
    }

    const newTower = await tower.save();

    res.json(newTower);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put("/update/:id", upload.single("picture"), async (req, res) => {
  const { title, description } = req.body;
  const { id } = req.params;

  const date = new Date();
  const localeDate = date.toLocaleDateString();
  const localTime = date.toLocaleTimeString();

  try {
    const towerToUpdate = await Tower.findById(id);

    if (req.file) {
      fs.unlink(`./uploads/${towerToUpdate.picture}`, function (err) {
        if (err) throw new Error();
      });
    }

    await Tower.updateOne(
      { _id: id },
      {
        title: title,
        picture: req.file.filename,
        description: description,
        date: `le ${localeDate} à ${localTime}`,
      }
    );

    const tower = await Tower.findById(id);

    res.json(tower);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const tower = await Tower.findById(id);

    if (tower.picture && !tower.picture.includes("http")) {
      fs.unlink(`./uploads/${tower.picture}`, function (err) {
        if (err) throw new Error();
      });
    }

    await Tower.deleteOne({
      _id: req.params.id,
    });

    res.status(200).json("delete");
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
