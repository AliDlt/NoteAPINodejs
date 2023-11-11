const mongoose = require("mongoose");

const tagSchmea = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  note: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Note",
    },
  ],
});

module.exports = mongoose.model("Tag", tagSchmea);
