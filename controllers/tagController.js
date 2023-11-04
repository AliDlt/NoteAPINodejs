const Tag = require("../models/Tag");

// Get tag by ID
const getTagById = async (req, res) => {
  const tagId = req.params.id;

  try {
    const tag = await Tag.findById(tagId);

    if (!tag) {
      return res.status(404).json({ message: "تگ پیدا نشد" });
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
      res.json("هیچ تگی وجود ندارد.");
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
    const tagId = req.body.id;
    const updatedTag = await Tag.findByIdAndUpdate(
      tagId,
      { title },
      { new: true }
    );

    if (!updatedTag) {
      return res.status(404).json({ message: "تگ پیدا نشد" });
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
    const tagId = req.body.id;

    const deletedTag = await Tag.findByIdAndDelete(tagId);

    if (!deletedTag) {
      return res.status(404).json({ message: "تگ پیدا نشد" });
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
