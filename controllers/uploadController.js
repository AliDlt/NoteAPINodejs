const User = require("../models/User");

const uploadImageConfig = require("../utils/uploadImageConfig");

require("dotenv").config();

const uploadImage = async (req, res) => {
  try {
    // Process the uploaded file
    uploadImageConfig.uploadConfig.single("file")(
      req,
      res,
      async function (err) {
        if (err) {
          return res.status(400).json({ message: err, data: null });
        }

        const userId = req.user._id;
        const user = await User.findById(userId);
        if (!user) {
          return res
            .status(404)
            .json({ message: "User not found", data: null });
        }

        if (req.file) {
          const processedResult = await uploadImageConfig.uploadImage(
            req.file.buffer,
            req.file.filename
          );

          await User.findOneAndUpdate(
            { _id: userId },
            {
              profile: processedResult.fileInfo.fileName,
            },
            { new: true }
          );

          const url = `${
            "http://" + process.env.URL + ":" + process.env.PORT
          }/images/${processedResult.fileInfo.fileName}`;

          return res.status(201).json({
            message: "profile successfully updated",
            data: url,
          });
        } else {
          return res
            .status(400)
            .json({ message: "there is no file", data: null });
        }
      }
    );
  } catch (error) {
    return res.status(500).json({ message: error.message, data: null });
  }
};

const getImage = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found", data: null });
    }
    const image = user.profile;
    if (image) {
      const url = `${
        "http://" + process.env.URL + ":" + process.env.PORT
      }/images/${image}`;
      return res.status(200).json({ message: "successful", data: url });
    } else {
      return res.status(404).json({ message: "no image", data: null });
    }
  } catch (error) {
    return res.status(500).json({ message: error, data: null });
  }
};

module.exports = {
  uploadImage,
  getImage,
};
