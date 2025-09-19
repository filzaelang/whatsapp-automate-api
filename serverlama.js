const express = require("express");
const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode");

const app = express();
app.use(express.json()); //biar bisa baca body JSON

// Inisialisasi Whatsapp Client dengan LocalAuth (session tersimpan otomatis)
const client = new Client({
  authStrategy: new LocalAuth(),
});

let qrCodeData = null;
let isReady = false;

// Event ketika WhatsApp minta QR code
client.on("qr", (qr) => {
  qrCodeData = qr;
  isReady = false;
  console.log("QR Code received, scan with Whatsapp!");
});

// Event ketika sudah login
client.on("ready", () => {
  isReady = true;
  qrCodeData = null;
  console.log("WhatsApp is ready!");
});

client.initialize();

//Endpoint utama
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Login WhatsApp</title>
    </head>
    <body style="font-family: sans-serif; text-align: center; padding-top: 40px;">
      <h2>Scan QR WhatsApp</h2>
      <div id="qr-container">Loading QR...</div>
      <p id="status">Menunggu koneksi...</p>

      <script>
        async function fetchQR() {
          try {
            let res = await fetch("/qr");
            let text = await res.text();
            document.getElementById("qr-container").innerHTML = text;
          } catch (err) {
            document.getElementById("qr-container").innerHTML = "Gagal ambil QR";
          }
        }

        async function fetchStatus() {
          try {
            let res = await fetch("/status");
            let data = await res.json();
            document.getElementById("status").innerText = "Status: " + data.status;
            if (data.status === "disconnected") {
              fetchQR();
            } else {
              document.getElementById("qr-container").innerHTML = "<b>✅ Sudah login!</b>";
            }
          } catch (err) {
            document.getElementById("status").innerText = "Error cek status";
          }
        }

        // Jalankan loop setiap 3 detik
        fetchQR();
        fetchStatus();
        setInterval(fetchStatus, 3000);
      </script>
    </body>
    </html>
  `);
});

// Endpoint untuk ambil QR code (ditampilkan sebagai gambar base64)
app.get("/qr", async (req, res) => {
  if (!qrCodeData) {
    return res.send("QR Code tidak tersedia (mungkin sudah login).");
  }
  try {
    const qrImage = await qrcode.toDataURL(qrCodeData);
    res.send(`<img src="${qrImage}" />`);
  } catch (err) {
    res.status(500).send("Gagal generate QR");
  }
});

// Endpoint untuk cek status
app.get("/status", (req, res) => {
  res.json({
    status: isReady ? "connected" : "disconnected",
  });
});

// Endpoint untuk kirim pesan
app.post("/send", async (req, res) => {
  if (!isReady) {
    return res.status(400).json({ error: "WhatsApp belum siap" });
  }

  const { number, message } = req.body;

  if (!number || !message) {
    return res.status(400).json({ error: "number dan message wajib diisi!" });
  }

  try {
    // Format nomor WA: harus pakai kode negara, contoh : 62812345678912
    const chatId = number + "@c.us";
    await client.sendMessage(chatId, message);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Jalankan server di port 3015
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
