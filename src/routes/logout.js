const express = require("express");
const fs = require("fs");
const path = require("path");
const { getClient, resetClient } = require("../whatsapp");

const router = express.Router();

router.post("/", async (req, res) => {
  const client = getClient();

  try {
    await client.logout();

    const authPath = path.join(process.cwd(), ".wwebjs_auth");
    const cachePath = path.join(process.cwd(), ".wwebjs_cache");

    if (fs.existsSync(authPath))
      fs.rmSync(authPath, { recursive: true, force: true });
    if (fs.existsSync(cachePath))
      fs.rmSync(cachePath, { recursive: true, force: true });

    await resetClient();

    res.json({ success: true, message: "Logout berhasil, WhatsApp terputus" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
