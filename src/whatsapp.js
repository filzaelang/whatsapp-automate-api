const { Client, LocalAuth } = require("whatsapp-web.js");

let qrCodeData = null;
let isReady = false;

let client = createClient();

function createClient() {
  const c = new Client({
    authStrategy: new LocalAuth(),
  });

  c.on("qr", (qr) => {
    qrCodeData = qr;
    isReady = false;
    console.log("QR Code received, scan with Whatsapp!");
  });

  c.on("ready", () => {
    isReady = true;
    qrCodeData = null;
    console.log("Whatsapp is ready!");
  });

  c.on("disconnected", () => {
    isReady = false;
    console.log("Whatsapp disconnected");
  });

  c.initialize();
  return c;
}

async function resetClient() {
  if (client) {
    try {
      await client.destroy();
    } catch (err) {
      console.log("Error destroying client:", err.message);
    }
  }
  client = createClient();
}

function checkApiKey(req, res, next) {
  const apiKey = req.header("x-api-key");
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(403).json({ error: "Invalid or missing API key" });
  }
  next();
}

module.exports = {
  getClient: () => client,
  getQr: () => qrCodeData,
  isReady: () => isReady,
  resetClient,
  checkApiKey,
};
