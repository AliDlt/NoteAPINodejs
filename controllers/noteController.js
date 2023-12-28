const Note = require("../models/Note");
const Folder = require("../models/Folder");
const Tag = require("../models/Tag");
const Todo = require("../models/ToDo");

// Get note by ID
const getNoteById = async (req, res) => {
  const noteId = req.params.id;
  const userId = req.user._id;

  try {
    const note = await Note.findOne({ userId: userId, _id: noteId });

    if (!note) {
      return res
        .status(404)
        .json({ message: "the note wasn't found", data: null });
    }
    res.status(200).json({ message: "successful", data: note });
  } catch (error) {
    res
      .status(500)
      .json({ message: `there is an error: ${error.message}`, data: null });
  }
};

// searchNote
const searchNote = async (req, res) => {
  try {
    const search = req.params.search;
    const userId = req.user._id;

    const notes = await Note.find({
      userId: userId,
      $or: [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ],
    }).select("id title content");

    if (!notes || notes.length === 0) {
      return res.status(404).json({ message: "there is no note", data: null });
    }

    res.status(200).json({ message: "successful", data: notes });
  } catch (error) {
    res
      .status(500)
      .json({ message: `there is an error: ${error.message}`, data: null });
  }
};

// Get all notes
const getAllNotes = async (req, res) => {
  try {
    const userId = req.user._id;
    const notes = await Note.find({ userId });

    if (notes && notes.length > 0) {
      return res.status(200).json({ message: "Successful", data: notes });
    }

    return res.status(404).json({ message: "No notes found", data: null });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error: ${error.message}`, data: null });
  }
};

// Get all notes by folder
const getNotesByFolderId = async (req, res) => {
  try {
    const userId = req.user._id;
    const folderId = req.params.id;

    const notes = await Note.find({ userId, folderId });

    if (notes && notes.length > 0) {
      return res.status(200).json({ message: "Successful", data: notes });
    }

    return res.status(404).json({ message: "No notes found", data: null });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error: ${error.message}`, data: null });
  }
};

// Get all notes by folder with pagination
const getLimitedNotesByFolderId = async (req, res) => {
  try {
    const userId = req.user._id;
    const folderId = req.params.id;
    const page = parseInt(req.query.page) || 1;
    const amount = parseInt(req.query.amount) || 10;

    const skip = (page - 1) * amount;

    const totalNotes = await Note.countDocuments({ userId, folderId });
    const totalPages = Math.ceil(totalNotes / amount);

    const notes = await Note.find({ userId, folderId })
      .skip(skip)
      .limit(amount);

    if (notes && notes.length > 0) {
      return res.status(200).json({
        message: "Successful",
        data: {
          notes,
          totalNotes,
          totalPages,
        },
      });
    }

    return res.status(404).json({ message: "No notes found", data: null });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error: ${error.message}`, data: null });
  }
};

// Create a new note
const createNote = async (req, res) => {
  try {
    const userId = req.user._id;
    var { title, content, todos, folderId, tags } = req.body;

    const validTags = [];
    // Validate tag IDs
    if (tags != null && tags.length > 0) {
      for (let tagId of tags) {
        const tagExists = await Tag.exists({ _id: tagId });
        if (!tagExists) {
          return res
            .status(404)
            .json({ message: "there is no tag", data: null });
        }
        validTags.push(tagId);
      }
    }

    const validTodos = [];
    if (todos != null && todos.length > 0) {
      // Validate todo IDs
      for (let todoId of todos) {
        const todoExists = await Todo.exists({ _id: todoId });
        if (!todoExists) {
          return res
            .status(404)
            .json({ message: "there is no todo", data: null });
        }
        validTodos.push(todoId);
      }
    }

    // Check if the specified folder exists
    const folderExists = await Folder.exists({ _id: folderId });

    if (!folderExists) {
      // Check if the default folder ("Default Folder") exists
      const defaultFolder = await Folder.findOne({ title: "Default Folder" });

      if (!defaultFolder) {
        return res.status(404).json({
          message: "there is no default folder",
          data: null,
        });
      }

      folderId = defaultFolder._id;
    }

    // Use the specified folderId or find the default folder ("Default Folder")
    const folderToUse = folderId || defaultFolder._id;

    const note = new Note({
      title,
      content,
      todos: validTodos,
      folderId: folderToUse,
      tags: validTags,
      userId: userId,
    });
    await note.save();

    // Update the notes property of the associated folder
    await Folder.findByIdAndUpdate(folderToUse, { $push: { notes: note._id } });

    res.status(200).json({ message: "successful", data: note });
  } catch (error) {
    res
      .status(500)
      .json({ message: `there is an error: ${error.message}`, data: null });
  }
};

// Update an existing note by ID
const updateNote = async (req, res) => {
  try {
    const userId = req.user._id;
    var { title, content, todos, folderId, tags } = req.body;
    const noteId = req.params.id;

    const validTags = [];
    // Validate tag IDs
    if (tags != null && tags.length > 0) {
      for (let tagId of tags) {
        const tagExists = await Tag.exists({ _id: tagId });
        if (!tagExists) {
          return res
            .status(404)
            .json({ message: "there is no tag", data: null });
        }
        validTags.push(tagId);
      }
    }

    const validTodos = [];
    if (todos != null && todos.length > 0) {
      // Validate todo IDs
      for (let todoId of todos) {
        const todoExists = await Todo.exists({ _id: todoId });
        if (!todoExists) {
          return res
            .status(404)
            .json({ message: "there is no todo", data: null });
        }
        validTodos.push(todoId);
      }
    }

    // Check if the specified folder exists
    const folderExists = await Folder.exists({ _id: folderId });

    if (!folderExists) {
      // Check if the default folder ("Default Folder") exists
      const defaultFolder = await Folder.findOne({ title: "Default Folder" });

      if (!defaultFolder) {
        return res.status(404).json({
          message: "there is no default folder",
          data: null,
        });
      }

      folderId = defaultFolder._id;
    }

    const updatedNote = await Note.findByIdAndUpdate(
      noteId,
      {
        title,
        content,
        todos: validTodos,
        tags: validTags,
        folderId: folderId,
        userId,
      },
      { new: true }
    );

    if (!updatedNote) {
      return res.status(404).json({ message: "there is no note", data: null });
    }

    const updateFolderResult = await Folder.findByIdAndUpdate(folderId, {
      $push: { notes: noteId },
    });

    if (!updateFolderResult) {
      return res
        .status(500)
        .json({ message: "Failed to update folder", data: null });
    }
    res.status(200).json({ message: "successful", data: updatedNote });
  } catch (error) {
    res
      .status(500)
      .json({ message: `there is an error: ${error.message}`, data: null });
  }
};

// Delete a note by ID
const deleteNote = async (req, res) => {
  try {
    const noteId = req.params.id;
    const userId = req.user._id;
    const deletedNote = await Note.findOneAndDelete({ _id: noteId, userId });

    if (!deletedNote) {
      return res.status(404).json({ message: "there is no note", data: null });
    }

    // Get the ID of the folder this note belonged to
    const folderId = deletedNote.folderId;

    // Remove the note ID from the folder's notes array
    const updateFolderResult = await Folder.findByIdAndUpdate(folderId, {
      $pull: { notes: noteId },
    });

    if (!updateFolderResult) {
      // Handle the case where the folder update was not successful
      return res
        .status(500)
        .json({ message: "Failed to update folder", data: null });
    }

    // Get all todso that contain this note
    const todosWithNote = await Todo.find({ notes: noteId });

    // Remove the note ID from the notes array in each todo
    for (let todo of todosWithNote) {
      const updateTodoResult = await Todo.findByIdAndUpdate(todo, {
        $pull: { notes: noteId },
      });

      if (!updateTodoResult) {
        // Handle the case where the todo update was not successful
        return res
          .status(500)
          .json({ message: "Failed to update todo", data: null });
      }
    }

    res.status(200).json({ message: "successful", data: deletedNote });
  } catch (error) {
    res
      .status(500)
      .json({ message: `there is an error: ${error.message}`, data: null });
  }
};

module.exports = {
  getAllNotes,
  getNotesByFolderId,
  getLimitedNotesByFolderId,
  createNote,
  updateNote,
  deleteNote,
  getNoteById,
  searchNote,
};
