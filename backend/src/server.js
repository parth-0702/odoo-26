const path = require("path");
const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;
const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

console.log({
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT,
  mongoUriExists: !!mongoUri,
  frontendOrigin: process.env.CLIENT_ORIGIN || "(not set)",
});

if (mongoUri) {
  console.log("Mongo URI:", mongoUri.replace(/\/\/.*@/, "//****@"));
}

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN?.split(",") || "*",
    credentials: true,
  })
);
app.use(express.json({ limit: "5mb" }));

app.get("/health", (_req, res) => res.json({ status: "ok", service: "arjuna-tms-api" }));

async function boot() {
  await connectDB();
}

if (require.main === module && process.env.VERCEL !== "1") {
  boot()
    .then(() => {
      app.listen(PORT, () => console.log(`🚚 ARJUNA TMS API running on :${PORT}`));
    })
    .catch((err) => {
      console.error("Failed to start server:", err.message);
      process.exit(1);
    });
} else {
  boot().catch((err) => {
    console.error("Failed to initialize MongoDB:", err.message);
  });
}

module.exports = app;