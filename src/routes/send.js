const express = require("express");
const { getClient, isReady } = require("../whatsapp");

const router = express.Router();

router.post("/", async (req, res) => {
  const client = getClient();

  if (!isReady()) {
    return res.status(400).json({ error: "Whatsapp belum siap" });
  }

  const { number, message } = req.body;

  if (!number || !message) {
    return res.status(400).json({ error: "number dan message wajib diisi" });
  }

  try {
    const chatId = number + "@c.us";
    await client.sendMessage(chatId, message);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
