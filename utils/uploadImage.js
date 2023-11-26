const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const sharp = require("sharp");
const appRoot = require("app-root-path");

const fileName = `${uuidv4()}`;

const uploadConfig = multer({
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Please upload an image"));
    }
    cb(undefined, true);
  },
});

const uploadImage = async (buffer, fileName) => {
  try {
    const processedImageBuffer = await sharp(buffer)
      .jpeg({ quality: 60 })
      .resize({ width: 250, height: 250 })
      .toFile(`${appRoot}/public/uploads/${fileName}`);

    if (!processedImageBuffer) {
      throw new Error("Error processing image");
    }
    return {
      message: "Image uploaded and processed successfully",
      fileInfo: { fileName },
    };
  } catch (error) {
    console.error(error);
    return { message: "Internal server error" };
  }
};

module.exports = {
  uploadImage,
  uploadConfig,
};
