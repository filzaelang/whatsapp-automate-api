const express = require("express");
const { isReady } = require("../whatsapp");

const router = express.Router();

router.get("/", (req, res) => {
  const state = isReady() ? "authenticated" : "disconnected";
  res.json({ status: state });
});

module.exports = router;
