const mongoose = require("mongoose");

const tagSchmea = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
});

module.exports = mongoose.model("Tag", tagSchmea);
