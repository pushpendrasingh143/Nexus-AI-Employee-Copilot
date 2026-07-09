const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const errorHandler = require("./middleware/error.middleware");
const v1Routes = require("./routes/v1");

const app = express();

app.use(helmet());

const allowedOrigins = [
  "http://localhost:5173",
  "https://nexus-ai-employee-copilot.vercel.app",
];

if (process.env.CLIENT_URL) {
  allowedOrigins.push(process.env.CLIENT_URL);
}

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      message: "Too many requests, please try again later.",
    },
  })
);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Nexus AI Employee Copilot Backend is running",
    version: "1.0.0",
  });
});

app.use("/api/v1", v1Routes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

app.use(errorHandler);

module.exports = app;