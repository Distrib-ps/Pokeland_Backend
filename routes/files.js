const express = require("express");
const router = express.Router();
const upload = require("../upload");

router.post("/", upload.single("file"), async (req, res) => {
  res.json({
    src: `http://localhost:8000/static/${req.file.filename}`,
  });
});

module.exports = router;
