const express = require("express");
const qrcode = require("qrcode");
const { getQr } = require("../whatsapp");

const router = express.Router();

router.get("/", async (req, res) => {
  const qrData = getQr();

  if (!qrData) {
    return res.send("QR Code tidak tersedia (mungkin sudah login).");
  }

  try {
    const qrImage = await qrcode.toDataURL(qrData);
    res.send(`<img src="${qrImage}" alt="QR Code" />`);
  } catch (err) {
    res.status(500).send("Gagal generate QR");
  }
});

module.exports = router;
