const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const Token = require("../models/Token");

require("dotenv").config();

function generateToken(payload, expiresIn) {
  try {
    const tokenId = uuidv4();
    const options = { expiresIn, jwtid: tokenId };
    return jwt.sign(payload, process.env.SECRET_KEY, options);
  } catch (error) {
    throw new Error(error);
  }
}

async function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    const isToken = await isTokenBlacklisted(decoded.jti);

    if (isToken) {
      throw new Error("Token has been revoked");
    }

    addToBlacklist(decoded.jti, decoded.userId);

    return decoded;
  } catch (error) {
    throw error;
  }
}

async function verifyUserToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    return decoded;
  } catch (error) {
    throw error;
  }
}

const isTokenBlacklisted = async (tokenId) => {
  try {
    const count = await Token.countDocuments({ tokenId });
    return count > 0;
  } catch (error) {
    throw error;
  }
};

const addToBlacklist = async (tokenId, userId) => {
  try {
    const existingToken = await Token.findOne({ tokenId });

    if (!existingToken) {
      const revokedToken = new Token({
        tokenId,
        userId,
      });

      await revokedToken.save();
    } else {
      existingToken.userId = userId;
      await existingToken.save();
    }
  } catch (error) {
    throw error;
  }
};

module.exports = {
  generateToken,
  verifyToken,
  verifyUserToken,
};
