const express = require("express");
const { client } = require("../whatsapp");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    await client.destroy();
    res.json({ success: true, message: "Logout berhasil, WhatsApp terputus" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
