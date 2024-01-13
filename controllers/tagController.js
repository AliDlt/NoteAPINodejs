const Tag = require("../models/Tag");
const Note = require("../models/Note");

// Get tag by ID
const getTagById = async (req, res) => {
  const userId = req.user._id;
  const tagId = req.params.id;

  try {
    const tag = await Tag.findById({ _id: tagId, userId });

    if (!tag) {
      return res
        .status(404)
        .json({ message: "the tag wasn't found", data: null });
    }
    res.status(200).json(tag);
  } catch (error) {
    res
      .status(500)
      .json({ message: `there is an error: ${error.message}`, data: null });
  }
};

// Get all tags
const getAllTags = async (req, res) => {
  try {
    const userId = req.user._id;

    const tags = await Tag.find({ userId });

    if (tags != null && tags.length > 0) {
      res.status(200).json({ message: "successful", data: tags });
    } else {
      return res.status(404).json({ message: "there is no tag", data: null });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: `there is an error: ${error.message}`, data: null });
  }
};

// Create a new tag
const createTag = async (req, res) => {
  try {
    const userId = req.user._id;

    const { title, noteId } = req.body;

    let tag;
    if (noteId) {
      const note = await Note.findById({ _id: noteId, userId });
      if (!note) {
        return res
          .status(404)
          .json({ message: "The note wasn't found", data: null });
      }
      tag = new Tag({ title, noteId });
      await tag.save();
      // Update the Note with the new todoId
      await Note.findByIdAndUpdate(noteId, { $push: { tags: tag._id } });
    } else {
      tag = new Tag({ title });
      await tag.save();
    }
    res.status(200).json({ message: "Successful", data: tag });
  } catch (error) {
    if (error.code === 11000 && error.keyPattern.title) {
      res.status(400).json({ message: "tag is already exist", data: null });
    } else {
      res
        .status(500)
        .json({ message: `there is an error: ${error.message}`, data: null });
    }
  }
};

// Update an existing tag by ID
const updateTag = async (req, res) => {
  try {
    const userId = req.user._id;

    const tagId = req.params.id;
    const { title, noteId } = req.body;

    if (noteId) {
      const note = await Note.findById({ _id: noteId, userId });
      if (!note) {
        return res
          .status(404)
          .json({ message: "The note wasn't found", data: null });
      }
    }

    const updateFields = { title };
    if (noteId) {
      updateFields.noteId = noteId;
    }

    const updatedTag = await Tag.findByIdAndUpdate(tagId, updateFields, {
      new: true,
    });

    if (!updatedTag) {
      return res
        .status(404)
        .json({ message: "error in updating tag", data: null });
    }

    res.status(200).json({ message: "Successful", data: updatedTag });
  } catch (error) {
    if (error.code === 11000 && error.keyPattern.title) {
      res.status(400).json({ message: "tag is already exist", data: null });
    } else {
      res
        .status(500)
        .json({ message: `there is an error: ${error.message}`, data: null });
    }
  }
};

// Delete a tag by ID
const deleteTag = async (req, res) => {
  try {
    const userId = req.user._id;

    const tagId = req.params.id;

    const deletedTag = await Tag.findByIdAndDelete({ _id: tagId, userId });

    if (!deletedTag) {
      return res
        .status(404)
        .json({ message: "The tag wasn't found", data: null });
    }

    // Get all notes that contain this tag
    const notesWithTag = await Note.find({ tags: tagId });

    for (let note of notesWithTag) {
      try {
        // Remove the tag ID from the tags array in each note
        await Note.findByIdAndUpdate(note._id, {
          $pull: { tags: tagId },
        });
      } catch (noteUpdateError) {
        // Handle the case where the note update was not successful
        return res
          .status(500)
          .json({ message: "Failed to update note", data: null });
      }
    }

    res.status(200).json({ message: "Successful", data: deletedTag });
  } catch (error) {
    res
      .status(500)
      .json({ message: `there is and error : ${error}`, data: null });
  }
};

module.exports = {
  getAllTags,
  createTag,
  updateTag,
  deleteTag,
  getTagById,
};
