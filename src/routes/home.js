const express = require("express");

const router = express.Router();

router.get("/", async (req, res) => {
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
      <p id="name"></p>
      <p id="number"></p>
      <button id="logout" style="margin-top:20px; padding:10px;">Logout</button>

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

            if (data.user) {
              document.getElementById("name").innerText = "Nama: " + data.user?.name;
              document.getElementById("number").innerText = "Nomor: " + data.user?.number;
            }

            if (data.status === "disconnected") {
              fetchQR();
            } else {
              document.getElementById("qr-container").innerHTML = "<b> Sudah login!</b>";
            }
          } catch (err) {
            console.error(err)
            document.getElementById("status").innerText = "Error cek console";
          }
        }

        async function logout() {
          let res = await fetch("/logout", { method: "POST" });
          let data = await res.json();
          alert(data.message || "Logout!");
          fetchStatus();
        }

        document.getElementById("logout").addEventListener("click", logout);

        // Jalankan loop setiap 3 detik
        fetchQR();
        fetchStatus();
        setInterval(fetchStatus, 3000);
      </script>
    </body>
    </html>
  `);
});

module.exports = router;
