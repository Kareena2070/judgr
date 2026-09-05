require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = require("../models/User.model.js");
const config = require("../config/index.js");
const ApiError = require("../utils/ApiError.js");
const logger = require("../utils/logger.js");

const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    logger.info("MongoDB connected");
  } catch (error) {
    throw new ApiError(
      500,
      "DATABASE_CONNECTION_FAILED",
      "Failed to connect to MongoDB",
      error,
    );
  }
};

const adminName = process.env.ADMIN_NAME;
const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;

if (!adminName || !adminEmail || !adminPassword) {
  throw new ApiError(
    400,
    "MISSING_ADMIN_ENV",
    "Missing required admin environment variables",
  );
}

const seedAdmin = async () => {
  const normalizedEmail = adminEmail.trim().toLowerCase();

  const existingAdmin = await User.findOne({
    email: normalizedEmail,
  });

  if (existingAdmin) {
    logger.info({ email: normalizedEmail }, "Admin already exists");
    return;
  }

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  const admin = await User.create({
    name: adminName.trim(),
    email: normalizedEmail,
    passwordHash,
    role: "admin",
    isActive: true,
  });

  logger.info({ email: admin.email }, "Admin created successfully");
};

const run = async () => {
  try {
    await connectDB();
    await seedAdmin();
  } catch (error) {
    if (error instanceof ApiError) {
      logger.error(
        {
          code: error.code,
          statusCode: error.statusCode,
          details: error.details,
        },
        error.message,
      );
    } else {
      logger.error({ error }, "Admin seed failed");
    }

    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    logger.info("MongoDB disconnected");
  }
};

run();
