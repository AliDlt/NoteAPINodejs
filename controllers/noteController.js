const Note = require("../models/Note");
const Folder = require("../models/Folder");
const Tag = require("../models/Tag");
const Todo = require("../models/ToDo");

// Get note by ID
const getNoteById = async (req, res) => {
  const noteId = req.params.id;

  try {
    const note = await Note.findById(noteId);

    if (!note) {
      return res
        .status(404)
        .json({ message: "the note wasn't found", data: [] });
    }
    res.status(200).json({ message: "successful", data: [] });
  } catch (error) {
    res
      .status(500)
      .json({ message: `there is an error: ${error.message}`, data: [] });
  }
};

// searchNote
const searchNote = async (req, res) => {
  try {
    const search = req.params.search;

    const notes = await Note.find({
      $or: [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ],
    }).select("id title content");

    if (!notes || notes.length === 0) {
      return res.status(404).json({ message: "there is no note", data: [] });
    }

    res.status(200).json({ message: "successful", data: notes });
  } catch (error) {
    res
      .status(500)
      .json({ message: `there is an error: ${error.message}`, data: [] });
  }
};

// Get all notes
const getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find();

    if (notes != null && notes.length > 0) {
      res.status(200).json({ message: "successful", data: notes });
    } else {
      res.status(404).json({ message: "there is no note", data: [] });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: `there is an error: ${error.message}`, data: [] });
  }
};

//Get all notes by folder
const getNotesByFolderId = async (req, res) => {
  try {
    const folderId = req.params.id;
    const notes = await Note.find({ folder: folderId });

    if (notes != null && notes.length > 0) {
      res.status(200).json({ message: "successful", data: notes });
    } else {
      res.status(404).json({ message: "there is no note", data: [] });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: `there is an error: ${error.message}`, data: [] });
  }
};

// Create a new note
const createNote = async (req, res) => {
  try {
    var { title, content, todos, folderId, tags } = req.body;

    const validTags = [];
    // Validate tag IDs
    if (tags != null && tags.length > 0) {
      for (let tagId of tags) {
        const tagExists = await Tag.exists({ _id: tagId });
        if (!tagExists) {
          return res.status(404).json({ message: "there is no tag", data: [] });
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
            .json({ message: "there is no todo", data: [] });
        }
        validTodos.push(todoId);
      }
    }

    // Check if the specified folder exists
    const folderExists = await Folder.exists({ _id: folderId });

    if (!folderExists) {
      // Check if the default folder ("All Notes") exists
      const defaultFolder = await Folder.findOne({ title: "All Notes" });

      if (!defaultFolder) {
        return res.status(404).json({
          message: "there is no default folder",
          data: [],
        });
      }

      folderId = defaultFolder._id;
    }

    // Use the specified folderId or find the default folder ("All Notes")
    const folderToUse = folderId || ReadableStreamDefaultController._id;

    const note = new Note({
      title,
      content,
      todos: validTodos,
      folder: folderToUse,
      tags: validTags,
    });
    await note.save();

    // Update the notes property of the associated folder
    await Folder.findByIdAndUpdate(folderToUse, { $push: { notes: note._id } });

    res.status(200).json({ message: "successful", data: note });
  } catch (error) {
    res
      .status(500)
      .json({ message: `there is an error: ${error.message}`, data: [] });
  }
};

// Update an existing note by ID
const updateNote = async (req, res) => {
  try {
    var { title, content, todos, folderId, tags } = req.body;
    const noteId = req.params.id;

    const validTags = [];
    // Validate tag IDs
    if (tags != null && tags.length > 0) {
      for (let tagId of tags) {
        const tagExists = await Tag.exists({ _id: tagId });
        if (!tagExists) {
          return res.status(404).json({ message: "there is no tag", data: [] });
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
            .json({ message: "there is no todo", data: [] });
        }
        validTodos.push(todoId);
      }
    }

    // Check if the specified folder exists
    const folderExists = await Folder.exists({ _id: folderId });

    if (!folderExists) {
      // Check if the default folder ("All Notes") exists
      const defaultFolder = await Folder.findOne({ title: "All Notes" });

      if (!defaultFolder) {
        return res.status(404).json({
          message: "there is no default folder",
          data: [],
        });
      }

      folderId = defaultFolder._id;
    }

    const updatedNote = await Note.findByIdAndUpdate(
      noteId,
      { title, content, todos: validTodos, tags: validTags, folder: folderId },
      { new: true }
    );

    if (!updatedNote) {
      return res.status(404).json({ message: "there is no note", data: [] });
    }

    await Folder.findByIdAndUpdate(folderId, { $push: { notes: noteId } });

    res.status(200).json({ message: "successful", data: updatedNote });
  } catch (error) {
    res
      .status(500)
      .json({ message: `there is an error: ${error.message}`, data: [] });
  }
};

// Delete a note by ID
const deleteNote = async (req, res) => {
  try {
    const noteId = req.params.id;

    const deletedNote = await Note.findByIdAndDelete(noteId);

    if (!deletedNote) {
      return res.status(404).json({ message: "there is no note", data: [] });
    }

    // Get the ID of the folder this note belonged to
    const folderId = deletedNote.folder;

    // Remove the note ID from the folder's notes array
    await Folder.findByIdAndUpdate(folderId, {
      $pull: { notes: noteId },
    });

    // Get all todso that contain this note
    const todosWithNote = await Todo.find({ notes: noteId });

    // Remove the note ID from the notes array in each todos
    for (let todo of todosWithNote) {
      await Todo.findByIdAndUpdate(todo, {
        $pull: { notes: noteId },
      });
    }

    res.status(200).json({ message: "successful", data: deletedNote });
  } catch (error) {
    res
      .status(500)
      .json({ message: `there is an error: ${error.message}`, data: [] });
  }
};

module.exports = {
  getAllNotes,
  getNotesByFolderId,
  createNote,
  updateNote,
  deleteNote,
  getNoteById,
  searchNote,
};
