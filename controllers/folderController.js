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
        .json({ message: "the folder wasn't found", data: null });
    }

    // Check if the folder belongs to the authenticated user
    const user = req.user;
    if (!folder.userId.equals(user._id)) {
      return res.status(403).json({
        message: "You do not have permission to access this folder",
        data: null,
      });
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
      .json({ message: `there is an error: ${error.message}`, data: null });
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
        .json({ message: "the folder didn't found", data: null });
    }

    // Check if the folder belongs to the authenticated user
    const user = req.user;
    if (!folder.userId.equals(user._id)) {
      return res.status(403).json({
        message: "You do not have permission to access this folder",
        data: null,
      });
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
      .json({ message: `there is an error: ${error.message}`, data: null });
  }
};

// Get Default Folder
const getDefaultFolder = async (req, res) => {
  try {
    const userId = req.user._id;
    const folder = await Folder.findOne({
      userId: userId,
      title: "Default Folder",
    });

    if (!folder) {
      return res
        .status(404)
        .json({ message: "the folder didn't found", data: null });
    }

    // Check if the folder belongs to the authenticated user
    const user = req.user;
    if (!folder.userId.equals(user._id)) {
      return res.status(403).json({
        message: "You do not have permission to access this folder",
        data: null,
      });
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
      .json({ message: `there is an error: ${error.message}`, data: null });
  }
};

// Get all folders by user id
const getAllFolders = async (req, res) => {
  try {
    const userId = req.user._id;
    const folders = await Folder.find({ userId: userId });

    if (folders != null && folders.length > 0) {
      res.status(200).json({ message: "successful", data: folders });
    } else {
      res.status(404).json({ message: "the folder didn't found", data: null });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: `there is an error: ${error}`, data: null });
  }
};

// Create a new folder
const createFolder = async (req, res) => {
  try {
    const userId = req.user._id;
    const title = req.body.title;
    const folder = new Folder({ title, userId });
    await folder.save();
    res.status(200).json({ message: "successful", data: folder });
  } catch (error) {
    if (error.code === 11000 && error.keyPattern.title) {
      res.status(400).json({ message: "the folder already exist", data: null });
    } else {
      res
        .status(500)
        .json({ message: `there is an error:${error.message}`, data: null });
    }
  }
};

// Update an existing folder by ID
const updateFolder = async (req, res) => {
  try {
    const userId = req.user._id;
    const title = req.body.title;
    const folderId = req.params.id;

    // Find the folder by ID and check if it belongs to the authenticated user
    const folder = await Folder.findById(folderId);
    if (!folder) {
      return res
        .status(404)
        .json({ message: "the folder didn't found", data: null });
    }

    if (!folder.userId.equals(userId)) {
      return res.status(403).json({
        message: "You do not have permission to update this folder",
        data: null,
      });
    }

    // Update the folder
    const updatedFolder = await Folder.findByIdAndUpdate(
      folderId,
      { title },
      { new: true }
    );

    if (!updatedFolder) {
      return res
        .status(404)
        .json({ message: "the folder didn't found", data: null });
    }

    res.status(200).json({ message: "successful", data: updatedFolder });
  } catch (error) {
    if (error.code === 11000 && error.keyPattern.title) {
      res.status(400).json({ message: "the folder already exist", data: null });
    } else {
      res
        .status(500)
        .json({ message: `there is an error :${error.message}`, data: null });
    }
  }
};

// Delete a folder by ID
const deleteFolder = async (req, res) => {
  try {
    const userId = req.user._id;
    const folderId = req.params.id;
    const allNotesFolder = await Folder.findOne({
      userId,
      title: "Default Folder",
    });

    if (
      allNotesFolder &&
      folderId.toString() === allNotesFolder._id.toString()
    ) {
      return res
        .status(400)
        .json({ message: "you can not delete default folder", data: null });
    }

    const deletedFolder = await Folder.findByIdAndDelete(folderId);

    if (!deletedFolder) {
      return res
        .status(404)
        .json({ message: "the folder didn't found", data: null });
    }

    res.status(200).json({ message: "successful", data: null });
  } catch (error) {
    res
      .status(500)
      .json({ message: `there is an error : ${error.message}`, data: null });
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
