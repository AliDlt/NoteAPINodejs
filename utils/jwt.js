const jwt = require("jsonwebtoken");

require("dotenv").config();

function generateToken(payload, expiresIn) {
  try {
    return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn });
  } catch (error) {
    console.error("Token generation error:", error);
    throw error;
  }
}

function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.SECRET_KEY);
  } catch (error) {
    console.error("Token verification error:", error);
    throw error;
  }
}

module.exports = { generateToken, verifyToken };
