const Folder = require("../models/Folder");
const Note = require("../models/Note");

// Get folder by ID
const getFolderById = async (req, res) => {
  const folderId = req.params.id;

  try {
    const folder = await Folder.findById(folderId);

    if (!folder) {
      return res.json([]);
    }

    // Get detailed notes for the folder
    const notes = await Note.find({
      _id: { $in: folder.notes },
    }).populate("todos tags");

    res.status(200).json({
      _id: folder._id,
      title: folder.title,
      notes: notes,
    });
  } catch (error) {
    res.status(500).json({ message: `خطایی به وجود آمد: ${error.message}` });
  }
};

// Get Detail Folder
const getDetailFolder = async (req, res) => {
  const folderId = req.params.id;

  try {
    const folder = await Folder.findById(folderId);

    if (!folder) {
      return res.json([]);
    }

    // Get detailed notes for the folder
    const notes = await Note.find({
      _id: { $in: folder.notes },
    }).populate("todos tags");

    res.status(200).json({
      _id: folder._id,
      title: folder.title,
      notes: notes,
    });
  } catch (error) {
    res.status(500).json({ message: `خطایی به وجود آمد: ${error.message}` });
  }
};

// Get all folders
const getAllFolders = async (req, res) => {
  try {
    const folders = await Folder.find();

    if (folders != null && folders.length > 0) {
      res.status(200).json(folders);
    } else {
      res.json([]);
    }
  } catch (error) {
    res.json(`خطایی به وجود آمده است : ${error}`);
  }
};

// Create a new folder
const createFolder = async (req, res) => {
  try {
    const title = req.body;
    const folder = new Folder(title);
    await folder.save();
    res.status(200).json(folder);
  } catch (error) {
    if (error.code === 11000 && error.keyPattern.title) {
      res
        .status(400)
        .json({ message: "فولدر با این عنوان قبلاً ایجاد شده است." });
    } else {
      res.status(500).json({ message: `خطایی به وجود آمد: ${error.message}` });
    }
  }
};

// Update an existing folder by ID
const updateFolder = async (req, res) => {
  try {
    const title = req.body;
    const folderId = req.params.id;

    const updatedFolder = await Folder.findByIdAndUpdate(folderId, title, {
      new: true,
    });

    if (!updatedFolder) {
      return res.json([]);
    }
    res.status(200).json(updatedFolder);
  } catch (error) {
    if (error.code === 11000 && error.keyPattern.title) {
      res
        .status(400)
        .json({ message: "فولدر با این عنوان قبلاً ایجاد شده است." });
    } else {
      res.status(500).json({ message: `خطایی به وجود آمد: ${error.message}` });
    }
  }
};

// Delete a folder by ID
const deleteFolder = async (req, res) => {
  try {
    const folderId = req.params.id;
    const allNotesFolder = await Folder.findOne({ title: "All Notes" });

    if (
      allNotesFolder &&
      folderId.toString() === allNotesFolder._id.toString()
    ) {
      return res
        .status(400)
        .json({ message: "شما نمی توانید فولدر پیش فرض را حذف کنید." });
    }

    const deletedFolder = await Folder.findByIdAndDelete(folderId);

    if (!deletedFolder) {
      return res.json([]);
    }

    res.status(200).json(deletedFolder);
  } catch (error) {
    res
      .status(500)
      .json({ message: `خطایی به وجود آمده است: ${error.message}` });
  }
};

module.exports = {
  getAllFolders,
  deleteFolder,
  updateFolder,
  createFolder,
  getFolderById,
  getDetailFolder,
};
