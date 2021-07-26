const express = require("express");
const fetch = require("node-fetch");

const Team = require("../models/Team");

const router = express.Router();

const checkInput = (value, reg) => {
  if (!reg.test(value)) {
    throw new Error();
  }
};

router.get("/teams/:id", async (req, res) => {
  try {
    const teams = await Team.find({ categoryId: req.params.id });
    res.json(teams);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.get("/all", async (req, res) => {
  try {
    const teams = await Team.find();
    res.json(teams);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.get("/team/:id", async (req, res) => {
  try {
    const response = await fetch(`https://pokepast.es/${req.params.id}`);
    const text = await response.text();

    const pokemonImgs = text.match(
      /<img class="img-pokemon" src="\/img\/pokemon\/.+\.png">/gm
    );

    const pokemonNames = text.match(/<pre><span class="type.+">.+<\/span>/gm);

    res.json({
      content: { images: pokemonImgs, names: pokemonNames },
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post("/add", async (req, res) => {
  const { title, categoryName, categoryId, link, description, idPokepast } =
    req.body;

  const date = new Date();
  const localeDate = date.toLocaleDateString();
  const localTime = date.toLocaleTimeString();

  try {
    checkInput(title, /^[A-Z][a-z 0-9]+/g);
    checkInput(link, /(https?:\/\/[^\s]+)/g);
    checkInput(description, /^[A-Z].+/g);
    checkInput(idPokepast, /[a-zA-Z0-9]/g);

    // CREATE NEW TIERS
    const team = new Team({
      title,
      categoryName: categoryName,
      categoryId: categoryId,
      link,
      description,
      idPokepast,
      date: `le ${localeDate} à ${localTime}`,
    });

    const newTeam = await team.save();

    res.json(newTeam);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put("/update/:id", async (req, res) => {
  const { title, categoryName, categoryId, link, description, idPokepast } =
    req.body;
  const { id } = req.params;

  try {
    checkInput(title, /^[A-Z][a-z 0-9]+/g);
    checkInput(link, /(https?:\/\/[^\s]+)/g);
    checkInput(description, /^[A-Z].+/g);
    checkInput(idPokepast, /[a-zA-Z0-9]/g);

    await Team.updateOne(
      { _id: id },
      {
        title: title,
        categoryName: categoryName,
        categoryId: categoryId,
        link: link,
        description: description,
        idPokepast: idPokepast,
      }
    );

    const team = await Team.findById(id);

    res.json(team);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    await Team.deleteOne({ _id: req.params.id });

    res.status(200).json("delete");
  } catch (err) {
    res.status(400).json(err);
  }
});

router.get("/team/:id", async (req, res) => {
  console.log(req.params.id);
  try {
    const response = await fetch(`https://pokepast.es/${req.params.id}`);
    const text = await response.text();

    const pokemonImgs = text.match(
      /<img class="img-pokemon" src="\/img\/pokemon\/.+\.png">/gm
    );

    const pokemonNames = text.match(/<pre><span class="type.+">.+<\/span>/gm);

    res.json({
      content: { images: pokemonImgs, names: pokemonNames },
      error: false,
    });
  } catch (err) {
    res.json({
      message: "Nous n'avons pas pu charger l'équipe",
      error: true,
    });
  }
});

module.exports = router;
