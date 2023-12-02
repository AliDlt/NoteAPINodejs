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
      return res.json([]);
    }
    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ message: `خطایی به وجود آمد: ${error.message}` });
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
      return res.json([]);
    }

    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: `خطایی به وجود آمد: ${error.message}` });
  }
};

// Get all notes
// const getAllNotes = async (req, res) => {
//   try {
//     const notes = await Note.find();

//     if (notes != null && notes.length > 0) {
//       res.status(200).json(notes);
//     } else {
//       res.json([]);
//     }
//   } catch (error) {
//     res.status(500).json({ message: `خطایی به وجود آمد: ${error.message}` });
//   }
// };

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
          return res.json([]);
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
          return res.json([]);
        }
        validTodos.push(todoId);
      }
    }

    // Check if the specified folder exists
    const folderExists = await Folder.exists({ _id: folderId });

    if (!folderExists) {
      // Check if the default folder ("All Notes") exists
      const defaultFolder = await Folder.findOne({ name: "All Notes" });

      if (!defaultFolder) {
        return res.json([]);
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

    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ message: `خطایی به وجود آمد: ${error.message}` });
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
          return res.json([]);
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
          return res.json([]);
        }
        validTodos.push(todoId);
      }
    }

    // Check if the specified folder exists
    const folderExists = await Folder.exists({ _id: folderId });

    if (!folderExists) {
      // Check if the default folder ("All Notes") exists
      const defaultFolder = await Folder.findOne({ name: "All Notes" });

      if (!defaultFolder) {
        return res.json([]);
      }

      folderId = defaultFolder._id;
    }

    const updatedNote = await Note.findByIdAndUpdate(
      noteId,
      { title, content, todos: validTodos, tags: validTags, folder: folderId },
      { new: true }
    );

    if (!updatedNote) {
      return res.json([]);
    }

    await Folder.findByIdAndUpdate(folderId, { $push: { notes: noteId } });

    res.status(200).json(updatedNote);
  } catch (error) {
    res.status(500).json({ message: `خطایی به وجود آمد: ${error.message}` });
  }
};

// Delete a note by ID
const deleteNote = async (req, res) => {
  try {
    const noteId = req.params.id;

    const deletedNote = await Note.findByIdAndDelete(noteId);

    if (!deletedNote) {
      return res.json([]);
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

    res.status(200).json(deletedNote);
  } catch (error) {
    res.status(500).json({ message: `خطایی به وجود آمد: ${error.message}` });
  }
};

module.exports = {
  // getAllNotes,
  createNote,
  updateNote,
  deleteNote,
  getNoteById,
  searchNote,
};
