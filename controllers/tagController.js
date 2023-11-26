const Tag = require("../models/Tag");
const Note = require("../models/Note");

// Get tag by ID
const getTagById = async (req, res) => {
  const tagId = req.params.id;

  try {
    const tag = await Tag.findById(tagId);

    if (!tag) {
      return res.status(404).json([]);
    }
    res.status(200).json(tag);
  } catch (error) {
    res.status(500).json({ message: `خطایی به وجود آمد: ${error.message}` });
  }
};

// Get all tags
const getAllTags = async (req, res) => {
  try {
    const tags = await Tag.find();

    if (tags != null && tags.length > 0) {
      res.json(tags);
    } else {
      return res.status(404).json([]);
    }
  } catch (error) {
    res.status(500).json({ message: `خطایی به وجود آمد: ${error.message}` });
  }
};

// Create a new tag
const createTag = async (req, res) => {
  try {
    const { title } = req.body;
    const tag = new Tag({ title });
    await tag.save();
    res.json("تگ با موفقیت افزوده شد.");
  } catch (error) {
    if (error.code === 11000 && error.keyPattern.title) {
      res.status(400).json({ message: "تگ با این عنوان قبلاً ایجاد شده است." });
    } else {
      res.status(500).json({ message: `خطایی به وجود آمد: ${error.message}` });
    }
  }
};

// Update an existing tag by ID
const updateTag = async (req, res) => {
  try {
    const { title } = req.body;
    const tagId = req.params.id;
    const updatedTag = await Tag.findByIdAndUpdate(
      tagId,
      { title },
      { new: true }
    );

    if (!updatedTag) {
      return res.status(404).json([]);
    }
    res.json("تگ با موفقیت آپدیت شد.");
  } catch (error) {
    if (error.code === 11000 && error.keyPattern.title) {
      res.status(400).json({ message: "تگ با این عنوان قبلاً ایجاد شده است." });
    } else {
      res.status(500).json({ message: `خطایی به وجود آمد: ${error.message}` });
    }
  }
};

// Delete a tag by ID
const deleteTag = async (req, res) => {
  try {
    const tagId = req.params.id;

    const deletedTag = await Tag.findByIdAndDelete(tagId);

    if (!deletedTag) {
      return res.status(404).json([]);
    }

    // Get all notes that contain this tag
    const notesWithTag = await Note.find({ tags: tagId });

    // Remove the tag ID from the tags array in each note
    for (let note of notesWithTag) {
      await Note.findByIdAndUpdate(note._id, {
        $pull: { tags: tagId },
      });
    }

    res.json({ message: "تگ با موفقیت حذف شد." });
  } catch (error) {
    res.status(500).json(`خطایی به وجود آمده است: ${error}`);
  }
};

module.exports = {
  getAllTags,
  createTag,
  updateTag,
  deleteTag,
  getTagById,
};
