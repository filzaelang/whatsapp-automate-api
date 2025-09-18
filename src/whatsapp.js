const { Client, LocalAuth } = require("whatsapp-web.js");

let qrCodeData = null;
let isReady = false;

const client = new Client({
  authStrategy: new LocalAuth(),
});

client.on("qr", (qr) => {
  qrCodeData = qr;
  isReady = false;
  console.log("QR Code received, scan with Whatsapp!");
});

client.on("ready", () => {
  isReady = true;
  qrCodeData = null;
  console.log("Whatsapp is ready!");
});

client.initialize();

module.exports = {
  client,
  getQr: () => qrCodeData,
  isReady: () => isReady,
};
