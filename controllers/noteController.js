const Note = require("../models/Note");
const Folder = require("../models/Folder");

// Get note by ID
const getNoteById = async (req, res) => {
  const noteId = req.params.id;

  try {
    const note = await Note.findById(noteId);

    if (!note) {
      return res.status(404).json({ message: "نوت پیدا نشد" });
    }
    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ message: `خطایی به وجود آمد: ${error.message}` });
  }
};

// searchNote
const searchNote = async (req, res) => {
  try {
    const search = req.query.search;

    const notes = await Note.find({
      $or: [
        { title: { $regex: search, $options: "i" } },
        { body: { $regex: search, $options: "i" } },
      ],
    }).select("id title");

    if (!notes) {
      return res.status(404).json({ message: "نوتی پیدا نشد" });
    }
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: `خطایی به وجود آمد: ${error.message}` });
  }
};

// Get all notes
const getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find();

    if (notes != null && notes.length > 0) {
      res.json(notes);
    } else {
      res.json("هیچ نوتی وجود ندارد.");
    }
  } catch (error) {
    res.status(500).json({ message: `خطایی به وجود آمد: ${error.message}` });
  }
};

// Create a new note
const createNote = async (req, res) => {
  try {
    const { title, content, todos, folderId, tags } = req.body;

    // Check if the specified folder exists
    const folderExists = await Folder.exists({ _id: folderId });

    if (!folderExists) {
      return res.status(400).json({ message: "فولدر مورد نظر وجود ندارد." });
    }

    const note = new Note({ title, content, todos, folderId, tags });
    await note.save();
    res.json("نوت با موفقیت افزوده شد.");
  } catch (error) {
    res.status(500).json({ message: `خطایی به وجود آمد: ${error.message}` });
  }
};

// Update an existing note by ID
const updateNote = async (req, res) => {
  try {
    const { title, content, todos, folderId, tags } = req.body;
    const noteId = req.body.id;

    // Check if the specified folder exists
    const folderExists = await Folder.exists({ _id: folderId });

    if (!folderExists) {
      return res.status(400).json({ message: "فولدر مورد نظر وجود ندارد." });
    }
    const updatedNote = await Note.findByIdAndUpdate(
      noteId,
      { title, content, todos, folderId, tags },
      { new: true }
    );

    if (!updatedNote) {
      return res.status(404).json({ message: "نوت پیدا نشد" });
    }
    res.json("نوت با موفقیت آپدیت شد.");
  } catch (error) {
    res.status(500).json({ message: `خطایی به وجود آمد: ${error.message}` });
  }
};

// Delete a note by ID
const deleteNote = async (req, res) => {
  try {
    const noteId = req.body.id;

    const deletedNote = await Note.findByIdAndDelete(noteId);

    if (!deletedNote) {
      return res.status(404).json({ message: "نوت پیدا نشد" });
    }

    res.json({ message: "نوت با موفقیت حذف شد." });
  } catch (error) {
    res.status(500).json({ message: `خطایی به وجود آمد: ${error.message}` });
  }
};

module.exports = {
  getAllNotes,
  createNote,
  updateNote,
  deleteNote,
  getNoteById,
  searchNote,
};
