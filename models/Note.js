const mongoose = require("mongoose");

const noteSchmea = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  folder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Folder",
  },
  todos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Todo",
    },
  ],
  tags: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tag",
    },
  ],
});

module.exports = mongoose.model("Note", noteSchmea);
