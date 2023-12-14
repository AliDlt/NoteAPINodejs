const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  fullname: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  isConfirmed: {
    type: Boolean,
    default: false,
  },
  passwordResetVersion: {
    type: Number,
    default: 0,
  },
  profile: {
    type: String,
  },
  folders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Folder",
    },
  ],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
