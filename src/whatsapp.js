const { Client, LocalAuth } = require("whatsapp-web.js");

let qrCodeData = null;
let isReady = false;
let userInfo = null;

let client = createClient();

function createClient() {
  const c = new Client({
    authStrategy: new LocalAuth(),
  });

  c.on("qr", (qr) => {
    qrCodeData = qr;
    isReady = false;
    userInfo = null;
    console.log("QR Code received, scan with Whatsapp!");
  });

  c.on("ready", () => {
    isReady = true;
    qrCodeData = null;
    userInfo = {
      number: client.info.wid.user,
      name: client.info.pushname,
    };
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

module.exports = {
  getClient: () => client,
  getQr: () => qrCodeData,
  isReady: () => isReady,
  resetClient,
  getUserInfo: () => userInfo,
};
