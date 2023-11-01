const Folder = require("../models/Folder");

// Get all folders
const getAllFolders = async (req, res) => {
  try {
    const folders = await Folder.find();

    if (folders != null && folders.length > 0) {
      res.json(folders);
    } else {
      res.json("هیچ فولدری وجود ندارد.");
    }
  } catch (error) {
    res.json(`خطایی به وجود آمده است : ${error}`);
  }
};

// Create a new folder
const createFolder = async (req, res) => {
  try {
    const name = req.body;
    const folder = new Folder(name);
    await folder.save();
    res.json("فولدر با موفقیت افزوده شد.");
  } catch (error) {
    res.json(`خطایی به وجود آمده است : ${error}`);
  }
};

// Update an existing folder by ID
const updateFolder = async (req, res) => {
  try {
    const name = req.body;
    const folderId = req.body.id;

    const updatedFolder = await Folder.findByIdAndUpdate(folderId, name, {
      new: true,
    });

    if (!updatedFolder) {
      return res.status(404).json({ message: "فولدر پیدا نشد" });
    }
    res.json("فولدر با موفقیت آپدیت شد.");
  } catch (error) {
    res.status(500).json(`خطایی به وجود آمده است: ${error}`);
  }
};

// Delete a folder by ID
const deleteFolder = async (req, res) => {
  try {
    const folderId = req.body.id;

    const deletedFolder = await Note.findByIdAndDelete(folderId);

    if (!deletedFolder) {
      return res.status(404).json({ message: "فولدر پیدا نشد" });
    }

    res.json({ message: "فولدر با موفقیت حذف شد." });
  } catch (error) {
    res.status(500).json(`خطایی به وجود آمده است: ${error}`);
  }
};

module.exports = { getAllFolders, deleteFolder, updateFolder, createFolder };
