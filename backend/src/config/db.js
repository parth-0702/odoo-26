const mongoose = require("mongoose");

/**
 * Connect to MongoDB. Fails fast with a clear message if MONGO_URI is missing
 * or unreachable so misconfiguration is obvious in local/dev setups.
 */
async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error("MONGO_URI is not set. Copy .env.example to .env and set it.");
  }
  mongoose.set("strictQuery", true);
  const conn = await mongoose.connect(uri);
  console.log(`✔ MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
  return conn;
}

module.exports = connectDB;