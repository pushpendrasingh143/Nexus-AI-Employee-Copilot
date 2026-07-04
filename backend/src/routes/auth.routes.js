const express = require("express");
const {
  registerUser,
  loginUser,
} = require("../controllers/auth.controller");

const authenticate = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/me", authenticate, (req, res) => {
  res.status(200).json({
    success: true,
    message: "User authenticated successfully",
    data: req.user,
  });
});

// Admin Only Test Route
router.get("/admin", authenticate, authorize("admin"), (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome Admin!",
    data: req.user,
  });
});

module.exports = router;