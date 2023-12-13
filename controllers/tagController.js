const Tag = require("../models/Tag");
const Note = require("../models/Note");

// Get tag by ID
const getTagById = async (req, res) => {
  const tagId = req.params.id;

  try {
    const tag = await Tag.findById(tagId);

    if (!tag) {
      return res
        .status(404)
        .json({ message: "the tag wasn't found", data: [] });
    }
    res.status(200).json(tag);
  } catch (error) {
    res
      .status(500)
      .json({ message: `there is an error: ${error.message}`, data: [] });
  }
};

// Get all tags
const getAllTags = async (req, res) => {
  try {
    const tags = await Tag.find();

    if (tags != null && tags.length > 0) {
      res.status(200).json(tags);
    } else {
      return res.status(404).json({ message: "there is no tag", data: [] });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: `there is an error: ${error.message}`, data: [] });
  }
};

// Create a new tag
const createTag = async (req, res) => {
  try {
    const { title, noteId } = req.body;

    const note = await Note.findById(noteId);

    if (!note) {
      return res
        .status(404)
        .json({ message: "The note wasn't found", data: [] });
    }

    const tag = new Tag({ title, noteId });
    await tag.save();

    // Update the Note with the new todoId
    await Note.findByIdAndUpdate(noteId, { $push: { tags: tag._id } });

    res.status(200).json({ message: "Successful", data: tag });
  } catch (error) {
    if (error.code === 11000 && error.keyPattern.title) {
      res.status(400).json({ message: "tag is already exist", data: [] });
    } else {
      res
        .status(500)
        .json({ message: `there is an error: ${error.message}`, data: [] });
    }
  }
};

// Update an existing tag by ID
const updateTag = async (req, res) => {
  try {
    const { title, noteId } = req.body;

    const note = await Note.findById(noteId);

    if (!note) {
      return res
        .status(404)
        .json({ message: "The note wasn't found", data: [] });
    }

    const tagId = req.params.id;
    const updatedTag = await Tag.findByIdAndUpdate(
      tagId,
      { title },
      { new: true }
    );

    if (!updatedTag) {
      return res
        .status(404)
        .json({ message: "The tag wasn't found", data: [] });
    }

    res.status(200).json({ message: "Successful", data: updatedTag });
  } catch (error) {
    if (error.code === 11000 && error.keyPattern.title) {
      res.status(400).json({ message: "tag is already exist", data: [] });
    } else {
      res
        .status(500)
        .json({ message: `there is an error: ${error.message}`, data: [] });
    }
  }
};

// Delete a tag by ID
const deleteTag = async (req, res) => {
  try {
    const tagId = req.params.id;

    const deletedTag = await Tag.findByIdAndDelete(tagId);

    if (!deletedTag) {
      return res
        .status(404)
        .json({ message: "The tag wasn't found", data: [] });
    }

    // Get all notes that contain this tag
    const notesWithTag = await Note.find({ tags: tagId });

    // Remove the tag ID from the tags array in each note
    for (let note of notesWithTag) {
      await Note.findByIdAndUpdate(note._id, {
        $pull: { tags: tagId },
      });
    }

    res.status(200).json({ message: "Successful", data: deletedTag });
  } catch (error) {
    res
      .status(500)
      .json({ message: `there is and error : ${error}`, data: [] });
  }
};

module.exports = {
  getAllTags,
  createTag,
  updateTag,
  deleteTag,
  getTagById,
};
