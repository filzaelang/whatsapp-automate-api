const express = require("express");
const { isReady } = require("../whatsapp");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ status: isReady() ? "connected" : "disconnected" });
});

module.exports = router;
