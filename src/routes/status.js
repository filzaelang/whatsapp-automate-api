const express = require("express");
const { isReady, getUserInfo } = require("../whatsapp");

const router = express.Router();

router.get("/", (req, res) => {
  if (isReady()) {
    res.json({
      status: "autheticated",
      user: getUserInfo(),
    });
  } else {
    res.json({
      status: "disconnected",
      user: null,
    });
  }
});

module.exports = router;
