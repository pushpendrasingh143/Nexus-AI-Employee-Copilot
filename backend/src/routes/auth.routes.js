const express = require("express");

const {
  registerUser,
  loginUser,
} = require("../controllers/auth.controller");

const authenticate = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");
const validate = require("../middleware/validate.middleware");

const {
  registerSchema,
  loginSchema,
} = require("../validations/auth.validation");

const router = express.Router();

router.post("/register", validate(registerSchema), registerUser);

router.post("/login", validate(loginSchema), loginUser);

router.get("/me", authenticate, (req, res) => {
  res.status(200).json({
    success: true,
    message: "User authenticated successfully",
    data: req.user,
  });
});

router.get("/admin", authenticate, authorize("admin"), (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome Admin!",
    data: req.user,
  });
});

module.exports = router;