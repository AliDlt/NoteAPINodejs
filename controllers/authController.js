const User = require("../models/User");
const createFolder = require("../utils/dbFunctions");

const uploadImage = require("../utils/uploadImage");
const { generateToken } = require("../utils/jwt");
const { sendConfirmationEmail } = require("../utils/nodemailer");

const registerUser = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      return res
        .status(400)
        .json({ message: "the user is already exist", data: false });
    }

    const confirmationToken = generateToken({ email });

    const sendEmail = await sendConfirmationEmail(
      fullname,
      email,
      confirmationToken
    );

    if (sendEmail.status) {
      const user = await User.create({ fullname, email, password });
      const folder = createFolder.initializeDefaultFolder(user._id);
      if (folder.data) {
        return res.status(201).json({
          message: "User registered successfully.Please active your account",
          data: true,
        });
      } else {
        return res.status(500).json({
          message: folder.error,
          data: false,
        });
      }
    } else {
      return res.status(500).json({
        message: "error in sending email",
        data: false,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error, data: false });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found", data: false });
    }
    if (user.password !== password) {
      return res
        .status(400)
        .json({ message: "Invalid credentials", data: false });
    }
    return res.status(200).json({ message: "Login successful", data: true });
  } catch (error) {
    res.status(500).json({ message: error, data: false });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { id, password } = req.body;
    const user = await User.findOne({ id });
    if (!user) {
      return res.status(404).json({ message: "User not found", data: false });
    }

    await User.findOneAndUpdate({ id }, { password }, { new: true });

    return res
      .status(200)
      .json({ message: "User successfully changed password", data: true });
  } catch (error) {
    res.status(500).json({ message: error, data: false });
  }
};

const confirmEmail = async (req, res) => {
  try {
    const { id } = req.body;
    const user = await User.findOne({ id });
    if (!user) {
      return res.status(404).json({ message: "User not found", data: false });
    }

    await User.findOneAndUpdate({ id }, { isConfirmed: true }, { new: true });

    return res
      .status(200)
      .json({ message: "account successfully confirmed", data: true });
  } catch (error) {
    res.status(500).json({ message: error, data: false });
  }
};

// const uploadProfileImage = async (req, res) => {
//   try {
//     const _id = req.params.id;
//     const user = await User.findOne({ _id });
//     if (!user) {
//       return res.status(404).json("User not found");
//     }
//     const buffer = req.file.buffer;
//     const path = uploadImage(buffer);
//     console.log(test);
//     console.log(path);

//     if (req.file) {
//       await User.findOneAndUpdate(
//         { _id },
//         {
//           profile: `${path}`,
//         },
//         { new: true }
//       );
//     } else {
//       return res.status(400).json("there is no file");
//     }

//     return res.status(201).json("profile successfully");
//   } catch (error) {
//     console.log(error);
//     res.status(500).json(error);
//   }
// };

const changeUser = async (req, res) => {
  try {
    const { id, fullname, password, email } = req.body;
    const user = await User.findOne({ id });
    if (!user) {
      return res.status(404).json({ message: "User not found", data: false });
    }

    if (req.file) {
      const { originalname, buffer } = req.file;
      const path = uploadImage(originalname, buffer);
      await User.findOneAndUpdate(
        { id },
        {
          fullname,
          password,
          email,
          profile: `${path}`,
        },
        { new: true }
      );
    } else {
      await User.findOneAndUpdate(
        { id },
        { fullname, password, email },
        { new: true }
      );
    }

    return res
      .status(200)
      .json({ message: "user successfully changed", data: true });
  } catch (error) {
    res.status(500).json({ message: error, data: false });
  }
};

module.exports = {
  registerUser,
  loginUser,
  resetPassword,
  confirmEmail,
  changeUser,
  // uploadProfileImage,
};
