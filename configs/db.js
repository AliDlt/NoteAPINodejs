const mongoose = require("mongoose");
const Folder = require("../models/Folder");

async function initializeDatabase() {
  try {
    const existingFolder = await Folder.findOne({ title: "All Notes" });

    if (!existingFolder) {
      const newFolder = new Folder({ title: "All Notes" });
      await newFolder.save();
    }
  } catch (error) {
    console.error(`Database initialization error: ${error.message}`);
  }
}

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

module.exports = { connectDB, initializeDatabase };
