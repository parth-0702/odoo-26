const mongoose = require("mongoose");

/**
 * Atlas connection debugging notes:
 * - If Atlas rejects the SRV lookup, verify your local DNS server or switch it
 *   temporarily to 8.8.8.8 or 1.1.1.1.
 * - If the cluster is not reachable from your machine, add your current IP to
 *   Atlas Network Access under Database Access / Network Access.
 * - If your environment cannot resolve `mongodb+srv://`, use the standard Atlas
 *   connection string from the Connect dialog (`mongodb://host1,host2/?replicaSet=...`).
 */

/**
 * Connect to MongoDB. Fails fast with a clear message if MONGO_URI is missing
 * or unreachable so misconfiguration is obvious in local/dev setups.
 */
async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error("MONGO_URI is missing in .env");
  }
  mongoose.set("strictQuery", true);

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (err) {
    throw buildMongoConnectionError(err);
  }
}

function buildMongoConnectionError(err) {
  const code = err?.code || err?.cause?.code;
  const message = String(err?.message || "MongoDB connection failed");
  const name = String(err?.name || "");
  const normalized = message.toLowerCase();

  if (normalized.includes("invalid scheme") || normalized.includes("invalid uri") || name === "MongoParseError") {
    return new Error(
      `MongoDB URI is invalid. Check the connection string format and special-character encoding. Original error: ${message}`
    );
  }

  if (code === 18 || normalized.includes("authentication failed") || normalized.includes("bad auth")) {
    return new Error(
      `MongoDB authentication failed. Check the username, password, and URI encoding. Original error: ${message}`
    );
  }

  if (normalized.includes("paused") || normalized.includes("instance is paused") || normalized.includes("cluster is paused")) {
    return new Error(
      `MongoDB Atlas cluster appears to be paused. Resume the cluster in Atlas and try again. Original error: ${message}`
    );
  }

  if (
    code === "ENOTFOUND" ||
    code === "EAI_AGAIN" ||
    normalized.includes("querysrv") ||
    normalized.includes("getaddrinfo")
  ) {
    if (String(process.env.MONGO_URI || "").startsWith("mongodb+srv://")) {
      console.error(
        "SRV DNS resolution failed for mongodb+srv://. If your network/DNS cannot resolve Atlas SRV records, use the standard MongoDB connection string from the Atlas Connect dialog instead."
      );
    }
    return new Error(
      `MongoDB DNS resolution failed. Check the Atlas host name, internet access, and DNS settings. Original error: ${message}`
    );
  }

  if (
    code === "ECONNREFUSED" ||
    code === "ETIMEDOUT" ||
    normalized.includes("server selection timed out") ||
    normalized.includes("network timeout")
  ) {
    return new Error(
      `MongoDB network access failed. Check Atlas IP allow-list, firewall/VPN rules, and cluster availability. Original error: ${message}`
    );
  }

  if (normalized.includes("not authorized") || normalized.includes("unauthorized") || normalized.includes("authentication error")) {
    return new Error(
      `MongoDB authentication or authorization failed. Check the DB user permissions and password. Original error: ${message}`
    );
  }

  return new Error(`MongoDB connection failed: ${message}`);
}

module.exports = connectDB;