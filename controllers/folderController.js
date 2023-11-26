const Folder = require("../models/Folder");
const Note = require("../models/Note");

// Get folder by ID
const getFolderById = async (req, res) => {
  const folderId = req.params.id;

  try {
    const folder = await Folder.findById(folderId);

    if (!folder) {
      return res.status(404).json([]);
    }

    // Get detailed notes for the folder
    const notes = await Note.find({
      _id: { $in: folder.notes },
    }).populate("todos tags");

    res.status(200).json({
      _id: folder._id,
      name: folder.name,
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
      res.json(folders);
    } else {
      res.status(404).json([]);
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
    const name = req.body;
    const folderId = req.params.id;

    const updatedFolder = await Folder.findByIdAndUpdate(folderId, name, {
      new: true,
    });

    if (!updatedFolder) {
      return res.status(404).json([]);
    }
    res.json("فولدر با موفقیت آپدیت شد.");
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
    const allNotesFolder = await Folder.findOne({ name: "All Notes" });

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
      return res.status(404).json([]);
    }

    res.json({ message: "فولدر با موفقیت حذف شد." });
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
};
