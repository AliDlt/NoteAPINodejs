const bcrypt = require("bcrypt");
const saltRounds = 10;

async function hashPassword(password) {
  try {
    return await bcrypt.hash(password, saltRounds);
  } catch (error) {
    throw error;
  }
}

async function comparePassword(password, hash) {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    throw error;
  }
}

module.exports = { hashPassword, comparePassword };
