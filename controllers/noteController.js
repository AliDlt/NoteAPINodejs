const Note = require("../models/note");

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
    res.json(`خطایی به وجود آمده است : ${error}`);
  }
};

// Create a new note
const createNote = async (req, res) => {
  try {
    const { title, content, todos, folder, tags } = req.body;
    const note = new Note({ title, content, folder, tags });
    await note.save();
    res.json("نوت با موفقیت افزوده شد.");
  } catch (error) {
    res.json(`خطایی به وجود آمده است : ${error}`);
  }
};

// Update an existing note by ID
const updateNote = async (req, res) => {
  try {
    const { title, content, folder, tags } = req.body;
    const noteId = req.body.id;

    const updatedNote = await Note.findByIdAndUpdate(
      noteId,
      { title, content, folder, tags },
      { new: true }
    );

    if (!updatedNote) {
      return res.status(404).json({ message: "نوت پیدا نشد" });
    }
    res.json("نوت با موفقیت آپدیت شد.");
  } catch (error) {
    res.status(500).json(`خطایی به وجود آمده است: ${error}`);
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
    res.status(500).json(`خطایی به وجود آمده است: ${error}`);
  }
};

module.exports = { getAllNotes, createNote, updateNote, deleteNote };
