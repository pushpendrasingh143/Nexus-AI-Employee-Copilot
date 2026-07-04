const errorHandler = require("./middleware/error.middleware");
const express = require("express");

const v1Routes = require("./routes/v1");

const app = express();

app.use(express.json());

app.use("/api/v1", (req, res, next) => {
  console.log("✅ Reached /api/v1");
  next();
});

app.use("/api/v1", v1Routes);


// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});
// Global Error Handler
app.use(errorHandler);
module.exports = app;