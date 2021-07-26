const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/User");
const fs = require("fs");
const upload = require("../upload");

const checkInput = (value, reg) => {
  if (!reg.test(value)) {
    throw new Error();
  }
};

router.post("/signup/google", async (req, res) => {
  const { name, email, profilePicture } = req.body;

  try {
    const user = await User.findOne({ email: email });
    if (user) throw new Error();

    const newUser = new User({
      pseudo: name,
      email: email,
      profilePicture: profilePicture,
      role: "User",
    });
    if (!newUser) throw new Error();

    const userSet = await newUser.save();
    if (!userSet) throw new Error();

    const token = jwt.sign({ _id: userSet._id }, process.env.TOKEN_SECRET);

    res.status(200).json({ userSet, token });
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post("/signup/form", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    checkInput(
      email,
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    );

    const user = await User.findOne({ email: email });
    if (user) throw new Error();

    checkInput(name, /[a-zA-z 0-9]+/g);
    checkInput(
      password,
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s)/
    );

    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const hash = await bcrypt.hash(password, salt);

    const newUser = new User({
      pseudo: name,
      email: email,
      password: hash,
      role: "User",
    });

    const userSet = await newUser.save();
    if (!userSet) throw new Error();

    const token = jwt.sign({ _id: userSet._id }, process.env.TOKEN_SECRET);

    res.status(200).json({ userSet, token });
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post("/signin/google", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email: email });
    if (!user) throw new Error();

    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);

    res.status(200).json({ user, token });
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post("/signin/form", async (req, res) => {
  const { email, password } = req.body;

  try {
    checkInput(
      email,
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    );

    const user = await User.findOne({ email: email });
    if (!user) throw new Error();

    checkInput(
      password,
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s)/
    );

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) throw new Error();

    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);

    res.status(200).json({ user, token });
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put("/update/:id", upload.single("file"), async (req, res) => {
  const { name, email, password, role } = req.body;
  const { id } = req.params;
  const file = req.file;

  try {
    checkInput(
      email,
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    );

    const user = await User.findOne({ email: email });
    if (user && user._id != id) {
      if (user.role !== "Owner") {
        throw new Error();
      }
    }

    checkInput(name, /[a-zA-z 0-9]+/g);

    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const hash = await bcrypt.hash(password, salt);
    let userToUpdate;

    if (password !== "Unmotdepassecaché" && !file) {
      await User.updateOne(
        { _id: id },
        {
          pseudo: name,
          email: email,
          password: hash,
          role: role,
        }
      );
    }

    if (file && password === "Unmotdepassecaché") {
      userToUpdate = await User.findById(id);

      if (
        userToUpdate.profilePicture &&
        !userToUpdate.profilePicture.includes("http")
      ) {
        fs.unlink(`./uploads/${userToUpdate.profilePicture}`, function (err) {
          if (err) throw new Error();
        });
      }

      await User.updateOne(
        { _id: id },
        {
          pseudo: name,
          email: email,
          profilePicture: file.filename,
          role: role,
        }
      );
    }

    if (password !== "Unmotdepassecaché" && file) {
      checkInput(
        password,
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s)/
      );

      userToUpdate = await User.findById(id);

      if (
        userToUpdate.profilePicture &&
        !userToUpdate.profilePicture.includes("http")
      ) {
        fs.unlink(`./uploads/${userToUpdate.profilePicture}`, function (err) {
          if (err) throw new Error();
        });
      }

      await User.updateOne(
        { _id: id },
        {
          pseudo: name,
          email: email,
          password: hash,
          profilePicture: file.filename,
          role: role,
        }
      );
    }

    if (!file && password === "Unmotdepassecaché") {
      await User.updateOne(
        { _id: id },
        {
          pseudo: name,
          email: email,
          role: role,
        }
      );
    }

    const userUpdated = await User.findById(id);

    res.status(200).json(userUpdated);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.get("/profile", async (req, res) => {
  const token = req.header("token");

  const verified = jwt.verify(token, process.env.TOKEN_SECRET);

  try {
    const user = await User.findById(verified._id);
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.get("/user/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.get("/all", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (user.profilePicture && !user.profilePicture.includes("http")) {
      fs.unlink(`./uploads/${user.profilePicture}`, function (err) {
        if (err) throw new Error();
      });
    }
    await User.deleteOne({ _id: id });

    res.status(200).json("delete");
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete("/delete-list/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (user.profilePicture && !user.profilePicture.includes("http")) {
      fs.unlink(`./uploads/${user.profilePicture}`, function (err) {
        if (err) throw new Error();
      });
    }
    await User.deleteOne({ _id: id });

    res.status(200).json("delete");
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
