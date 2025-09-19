function checkApiKey(req, res, next) {
  const apiKey = req.header("x-api-key");
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(403).json({ error: "Invalid or missing API key" });
  }
  next();
}

module.exports = checkApiKey;
