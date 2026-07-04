const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const {
  findUserByEmail,
  createUser,
} = require("../repositories/auth.repository");

// =========================
// Register User
// =========================
const registerUser = async (userData) => {
  const { name, email, password } = userData;

  // Check if user already exists
  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new Error("Email already registered");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const newUser = await createUser({
    name,
    email,
    password: hashedPassword,
  });

  // Remove password from response
  const { password: _, ...userWithoutPassword } = newUser;

  return userWithoutPassword;
};

// =========================
// Login User
// =========================
const loginUser = async (userData) => {
  const { email, password } = userData;

  // Check user
  const user = await findUserByEmail(email);

  if (!user) {
    throw new Error("Invalid email or password");
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  // Generate JWT Token
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );

  // Remove password from response
  const { password: _, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
    token,
  };
};

module.exports = {
  registerUser,
  loginUser,
};