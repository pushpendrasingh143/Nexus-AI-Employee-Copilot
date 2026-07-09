const prisma = require("../config/prisma");

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const checkDatabaseConnection = async () => {
  const maxAttempts = 3;
  let lastError = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      await prisma.$connect();
      await prisma.$queryRaw`SELECT 1`;

      return {
        status: "connected",
        message: "Database connection successful",
        attempts: attempt,
      };
    } catch (error) {
      lastError = error;

      if (attempt < maxAttempts) {
        await wait(3000);
      }
    }
  }

  return {
    status: "disconnected",
    message: lastError?.message || "Database connection failed",
    attempts: maxAttempts,
  };
};

const getSystemStatus = async () => {
  const database = await checkDatabaseConnection();

  const databaseReady = database.status === "connected";
  const aiReady = Boolean(process.env.GEMINI_API_KEY);
  const jwtReady = Boolean(process.env.JWT_SECRET);

  return {
    project: {
      name: "Nexus AI Employee Copilot",
      status: "demo_ready",
      version: "1.0.0",
      category: "AI-powered Enterprise Productivity Platform",
    },

    backend: {
      status: "running",
      environment: process.env.NODE_ENV || "development",
      port: process.env.PORT || 5000,
      timestamp: new Date().toISOString(),
    },

    database: {
      provider: "PostgreSQL",
      orm: "Prisma",
      hosting: "Neon",
      status: database.status,
      message: database.message,
      attempts: database.attempts,
    },

    ai: {
      provider: "Google Gemini",
      langchainEnabled: true,
      geminiApiConfigured: aiReady,
      status: aiReady ? "configured" : "missing_api_key",
    },

    security: {
      authentication: "JWT",
      passwordHashing: "bcrypt",
      roleBasedAccess: true,
      jwtConfigured: jwtReady,
    },

    modules: {
      auth: "ready",
      employees: "ready",
      departments: "ready",
      documents: "ready",
      ragSearch: "ready",
      chatHistory: "ready",
      analytics: "ready",
      agents: "ready",
      integrations: "demo_ready",
    },

    demoReadiness: {
      backendReady: true,
      databaseReady,
      aiReady,
      finalDemoReady: databaseReady && aiReady && jwtReady,
    },
  };
};

module.exports = {
  getSystemStatus,
};