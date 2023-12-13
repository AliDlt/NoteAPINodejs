const Folder = require("../models/Folder");
const Note = require("../models/Note");

// Get folder by ID
const getFolderById = async (req, res) => {
  const folderId = req.params.id;

  try {
    const folder = await Folder.findById(folderId);

    if (!folder) {
      return res
        .status(404)
        .json({ message: "the folder wasn't found", data: [] });
    }

    // Get detailed notes for the folder
    const notes = await Note.find({
      _id: { $in: folder.notes },
    }).populate("todos tags");

    res.status(200).json({
      message: "successful",
      data: {
        _id: folder._id,
        title: folder.title,
        notes: notes,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: `there is an error: ${error.message}`, data: [] });
  }
};

// Get Detail Folder
const getDetailFolder = async (req, res) => {
  const folderId = req.params.id;

  try {
    const folder = await Folder.findById(folderId);

    if (!folder) {
      return res
        .status(404)
        .json({ message: "the folder didn't found", data: [] });
    }

    // Get detailed notes for the folder
    const notes = await Note.find({
      _id: { $in: folder.notes },
    }).populate("todos tags");

    res.status(200).json({
      message: "successful",
      data: {
        _id: folder._id,
        title: folder.title,
        notes: notes,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: `there is an error: ${error.message}`, data: [] });
  }
};

// Get Default Folder
const getDefaultFolder = async (req, res) => {
  try {
    const folder = await Folder.findOne({ title: "Default Folder" });

    if (!folder) {
      return res
        .status(404)
        .json({ message: "the folder didn't found", data: [] });
    }

    // Get detailed notes for the folder
    const notes = await Note.find({
      _id: { $in: folder.notes },
    }).populate("todos tags");

    res.status(200).json({
      message: "successful",
      data: {
        _id: folder._id,
        title: folder.title,
        notes: notes,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: `there is an error: ${error.message}`, data: [] });
  }
};

// Get all folders
const getAllFolders = async (req, res) => {
  try {
    const folders = await Folder.find();

    if (folders != null && folders.length > 0) {
      res.status(200).json({ message: "successful", data: folders });
    } else {
      res.status(404).json({ message: "the folder didn't found", data: [] });
    }
  } catch (error) {
    res.status(500).json({ message: `there is an error: ${error}`, data: [] });
  }
};

// Create a new folder
const createFolder = async (req, res) => {
  try {
    const title = req.body;
    const folder = new Folder(title);
    await folder.save();
    res.status(200).json({ message: "successful", data: folder });
  } catch (error) {
    if (error.code === 11000 && error.keyPattern.title) {
      res.status(400).json({ message: "the folder already exist", data: [] });
    } else {
      res
        .status(500)
        .json({ message: `there is an error:${error.message}`, data: [] });
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
      return res
        .status(404)
        .json({ message: "the folder didn't found", data: [] });
    }
    res.status(200).json({ message: "successful", data: updatedFolder });
  } catch (error) {
    if (error.code === 11000 && error.keyPattern.title) {
      res.status(400).json({ message: "the folder already exist", data: [] });
    } else {
      res
        .status(500)
        .json({ message: `there is an error :${error.message}`, data: [] });
    }
  }
};

// Delete a folder by ID
const deleteFolder = async (req, res) => {
  try {
    const folderId = req.params.id;
    const allNotesFolder = await Folder.findOne({ title: "Default Folder" });

    if (
      allNotesFolder &&
      folderId.toString() === allNotesFolder._id.toString()
    ) {
      return res
        .status(400)
        .json({ message: "you can not delete default folder", data: [] });
    }

    const deletedFolder = await Folder.findByIdAndDelete(folderId);

    if (!deletedFolder) {
      return res
        .status(404)
        .json({ message: "the folder didn't found", data: [] });
    }

    res.status(200).json({ message: "successful", data: [] });
  } catch (error) {
    res
      .status(500)
      .json({ message: `there is an error : ${error.message}`, data: [] });
  }
};

module.exports = {
  getAllFolders,
  deleteFolder,
  updateFolder,
  createFolder,
  getFolderById,
  getDetailFolder,
  getDefaultFolder,
};
