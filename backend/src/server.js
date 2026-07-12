const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

console.log({
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT,
  mongoUriExists: !!process.env.MONGO_URI,
  frontendOrigin: process.env.CLIENT_ORIGIN || "(not set)",
});

if (process.env.MONGO_URI) {
  console.log("Mongo URI:", process.env.MONGO_URI.replace(/\/\/.*@/, "//****@"));
}

(async () => {
  try {
    await connectDB();
    app.listen(PORT, () => console.log(`🚚 ARJUNA TMS API running on :${PORT}`));
  } catch (err) {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  }
})();