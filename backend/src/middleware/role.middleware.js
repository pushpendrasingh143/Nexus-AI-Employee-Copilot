const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      // Check if user exists
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Authentication required.",
        });
      }

      // Check role
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: "Access denied. You do not have permission to perform this action.",
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal Server Error.",
      });
    }
  };
};

module.exports = authorize;