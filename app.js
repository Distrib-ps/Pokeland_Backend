const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const port = process.env.PORT || 8000;

dotenv.config();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/static", express.static(path.join(__dirname, "uploads")));

mongoose.connect(
  process.env.CONNEXION_DB,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("Connected to DB");
  }
);

app.use("/user", require("./routes/user"));
app.use("/tiers", require("./routes/tiers"));
app.use("/teams-general-tiers", require("./routes/teamsGeneralTier"));
app.use("/sub-teams-general-tiers", require("./routes/subTeamsGeneralTier"));
app.use("/teams-categories", require("./routes/teamsCategory"));
app.use("/teams", require("./routes/team"));
app.use("/tournaments-categories", require("./routes/tournamentsCategory"));
app.use("/tournaments", require("./routes/tournament"));
app.use("/files", require("./routes/files"));
app.use("/towers", require("./routes/tower"));
app.use("/forum-categories", require("./routes/forumCategory"));
app.use("/forum-topics", require("./routes/forumTopic"));
app.use("/forum-posts", require("./routes/forumPost"));

app.listen(port, () => {
  console.log(`App listen on port ${port}`);
});
