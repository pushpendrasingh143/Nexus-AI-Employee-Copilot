const ApiResponse = require("../utils/ApiResponse");

const healthCheck = (req, res) => {
  return res.status(200).json(
    new ApiResponse(
      200,
      "🚀 Nexus AI Employee Copilot Backend is Running!"
    )
  );
};

module.exports = {
  healthCheck,
};