const path = require("path");
const dns = require("dns").promises;
const https = require("https");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const TARGET_HOST = "cluster0.ryzjkvn.mongodb.net";
const TARGET_SRV = `_mongodb._tcp.${TARGET_HOST}`;

async function main() {
  console.log({
    NODE_ENV: process.env.NODE_ENV || "development",
    PORT: process.env.PORT || "5000",
    mongoUriExists: !!process.env.MONGO_URI,
    frontendOrigin: process.env.CLIENT_ORIGIN || "(not set)",
  });

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing in .env");
  }

  console.log("Mongo URI:", maskMongoUri(process.env.MONGO_URI));

  await checkInternetConnectivity();
  await checkDnsResolution();
  await checkSrvResolution();
  await checkMongooseConnection();
}

async function checkInternetConnectivity() {
  console.log("Checking internet connectivity...");
  await new Promise((resolve, reject) => {
    const req = https.get("https://www.google.com/generate_204", (res) => {
      console.log(`Internet connectivity: OK (${res.statusCode})`);
      res.resume();
      resolve();
    });

    req.setTimeout(8000, () => req.destroy(new Error("Internet connectivity check timed out")));
    req.on("error", (err) => {
      console.error("Internet connectivity check failed:", describeDnsLikeError(err));
      reject(err);
    });
  });
}

async function checkDnsResolution() {
  console.log(`Checking DNS resolution for ${TARGET_HOST}...`);
  try {
    const addresses = await dns.resolve(TARGET_HOST);
    console.log("DNS resolve result:", addresses);
  } catch (err) {
    console.error("DNS resolution failed:", describeDnsLikeError(err));
  }
}

async function checkSrvResolution() {
  console.log(`Checking SRV lookup for ${TARGET_SRV}...`);
  try {
    const records = await dns.resolveSrv(TARGET_SRV);
    console.log("SRV lookup result:", records);
  } catch (err) {
    console.error("SRV lookup failed:", describeDnsLikeError(err));
  }
}

async function checkMongooseConnection() {
  console.log("Checking mongoose connection...");

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });
    console.log("MongoDB connection test: OK");
  } catch (err) {
    console.error("MongoDB connection test failed:", classifyMongoError(err));
  } finally {
    await mongoose.disconnect().catch(() => {});
  }
}

function maskMongoUri(uri) {
  return uri.replace(/\/\/.*@/, "//****@");
}

function describeDnsLikeError(err) {
  return {
    name: err?.name,
    code: err?.code,
    message: err?.message,
    causeCode: err?.cause?.code,
  };
}

function classifyMongoError(err) {
  const code = err?.code || err?.cause?.code;
  const message = String(err?.message || "MongoDB connection failed");
  const normalized = message.toLowerCase();

  if (normalized.includes("invalid scheme") || normalized.includes("invalid uri") || err?.name === "MongoParseError") {
    return {
      type: "invalid-uri",
      message,
      hint: "Check the MongoDB URI format and special-character encoding.",
    };
  }

  if (code === 18 || normalized.includes("authentication failed") || normalized.includes("bad auth")) {
    return {
      type: "authentication-failure",
      message,
      hint: "Verify the Atlas database user, password, and permissions.",
    };
  }

  if (normalized.includes("paused") || normalized.includes("instance is paused") || normalized.includes("cluster is paused")) {
    return {
      type: "atlas-paused",
      message,
      hint: "Resume the Atlas cluster before retrying.",
    };
  }

  if (code === "ENOTFOUND" || code === "EAI_AGAIN" || normalized.includes("querysrv") || normalized.includes("getaddrinfo")) {
    return {
      type: "dns-resolution-failure",
      message,
      hint:
        "If mongodb+srv:// fails on this machine, switch DNS to 8.8.8.8 or 1.1.1.1 and use the standard Atlas connection string if necessary.",
    };
  }

  if (code === "ECONNREFUSED" || code === "ETIMEDOUT" || normalized.includes("server selection timed out") || normalized.includes("network timeout")) {
    return {
      type: "network-access-issue",
      message,
      hint: "Check Atlas Network Access/IP allowlist, VPN, firewall, and cluster availability.",
    };
  }

  if (normalized.includes("not authorized") || normalized.includes("unauthorized") || normalized.includes("authentication error")) {
    return {
      type: "authorization-failure",
      message,
      hint: "Check the database user's roles and access.",
    };
  }

  return {
    type: "unknown",
    message,
    hint: "Inspect the error details and Atlas connectivity settings.",
  };
}

main().catch((err) => {
  console.error("Mongo diagnostics script failed:", err.message);
  process.exitCode = 1;
});
