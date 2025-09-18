const express = require("express");

const homeRoutes = require("./routes/home");
const qrRoutes = require("./routes/qr");
const statusRoutes = require("./routes/status");
const sendRoutes = require("./routes/send");
const logoutRoutes = require("./routes/logout");

const app = express();
app.use(express.json());

app.use("/", homeRoutes);
app.use("/qr", qrRoutes);
app.use("/status", statusRoutes);
app.use("/send", sendRoutes);
app.use("/logout", logoutRoutes);

module.exports = app;
