const express = require("express");
const fetch = require("node-fetch");
const Tier = require("../models/Tier");

const router = express.Router();

const checkInput = (value, reg) => {
  if (!reg.test(value)) {
    throw new Error();
  }
};

router.get("/tier/:date/:usage", async (req, res) => {
  const { date, usage } = req.params;

  try {
    const response = await fetch(
      `https://www.smogon.com/stats/${date}/${usage}.txt`
    );
    const text = await response.text();

    const data = text;

    const words = data.split("\n");

    const pokemons = words.splice(5, words.length - 7);

    const splitPokemon = pokemons.map((pokemon) => {
      const pokemonSplit = pokemon.split("|");

      const pokemonObject = pokemonSplit.splice(1, 3);

      return pokemonObject;
    });

    res.json(splitPokemon);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.get("/tiers", async (req, res) => {
  try {
    const tiers = await Tier.find();
    res.json(tiers);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post("/add", async (req, res) => {
  const { date, name } = req.body;

  try {
    checkInput(date, /^\d+-\d+$/);
    checkInput(name, /^[a-z][a-z0-9]+-\d+$/g);

    const newTier = new Tier({
      date: date,
      name: name,
    });

    const tierSet = await newTier.save();
    if (!tierSet) throw new Error();

    res.json(tierSet);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put("/update/:id", async (req, res) => {
  const { date, name } = req.body;
  const { id } = req.params;

  try {
    checkInput(date, /^\d+-\d+$/);
    checkInput(name, /^[a-z][a-z0-9]+-\d+$/g);

    await Tier.updateOne({ _id: id }, { date: date, name: name });

    const tier = await Tier.findById(id);

    res.json(tier);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    await Tier.deleteOne({ _id: req.params.id });

    res.status(200).json("delete");
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
