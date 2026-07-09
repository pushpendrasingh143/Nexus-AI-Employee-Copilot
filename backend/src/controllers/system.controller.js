const systemService = require("../services/system.service");

const getSystemStatus = async (req, res, next) => {
  try {
    const status = await systemService.getSystemStatus();

    res.status(200).json({
      success: true,
      message: "System status fetched successfully",
      data: status,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSystemStatus,
};