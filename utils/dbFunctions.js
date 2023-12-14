const Folder = require("../models/Folder");

async function initializeDefaultFolder(userId) {
  try {
    const existingFolder = await Folder.findOne({ userId });
    if (!existingFolder) {
      const newFolder = new Folder({ title: "Default Folder", userId });
      await newFolder.save();
      return { message: "successful", data: newFolder };
    } else {
      return { message: "successful", data: existingFolder };
    }
  } catch (error) {
    return { message: error, data: null };
  }
}

module.exports = { initializeDefaultFolder };
