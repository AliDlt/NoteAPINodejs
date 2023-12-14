const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");

const storage = multer.memoryStorage();

const uploadConfig = multer({
  limits: {
    fileSize: 1024 * 1024 * 1,
    files: 1,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new multer.MulterError("LIMIT_FILE_TYPE", "Invalid file type"));
    }
    cb(null, true);
  },
  storage: storage,
});

const uploadImage = async (buffer, fileName) => {
  try {
    const processedImageBuffer = await sharp(buffer)
      .jpeg({ quality: 60 })
      .resize({ width: 450, height: 450 })
      .toBuffer();

    const processedFileName = `${uuidv4()}-processed.jpg`;
    await sharp(processedImageBuffer).toFile(
      `public/images/${processedFileName}`
    );

    return {
      message: "Image uploaded and processed successfully",
      fileInfo: { fileName: processedFileName },
    };
  } catch (error) {
    console.error("Sharp Error:", error.message);
    return { message: "Internal server error" };
  }
};

module.exports = {
  uploadConfig,
  uploadImage,
};
