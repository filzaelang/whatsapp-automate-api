const express = require("express");
const { getClient, isReady, checkApiKey } = require("../whatsapp");

const router = express.Router();

router.post("/", checkApiKey, async (req, res) => {
  const client = getClient();
  const { number, message } = req.body;

  if (!number || !message) {
    return res.status(400).json({ error: "number dan message wajib diisi" });
  }

  if (!isReady()) {
    return res.status(400).json({ error: "Whatsapp belum siap" });
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
