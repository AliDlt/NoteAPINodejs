const mongoose = require("mongoose");

const revokedTokenSchema = new mongoose.Schema({
  tokenId: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Token = mongoose.model("Token", revokedTokenSchema);

module.exports = Token;
