const User = require("../models/User");

const dbFunctions = require("../utils/dbFunctions");
const { hashPassword, comparePassword } = require("../utils/hashPassword");
const uploadImage = require("../utils/uploadImage");

const { generateToken, verifyToken } = require("../utils/jwt");

const {
  sendConfirmationEmail,
  sendResetPassEmail,
} = require("../utils/nodemailer");

const getUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found", data: false });
    }

    return res.status(200).json({ message: "successfull", data: user });
  } catch (error) {
    res.status(500).json({ message: error, data: false });
  }
};

const registerUser = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      return res
        .status(400)
        .json({ message: "the user is already exist", data: false });
    } else {
      const hashedPassword = await hashPassword(password);
      const newUser = await User.create({
        fullname,
        email,
        password: hashedPassword,
      });
      const folderResult = await dbFunctions.initializeDefaultFolder(
        newUser._id
      );
      if (folderResult.data) {
        newUser.folders.push(folderResult.data._id);
        await newUser.save();

        const confirmationToken = generateToken({ userId: newUser._id }, "1d");

        const sendEmail = await sendConfirmationEmail(
          fullname,
          email,
          confirmationToken
        );

        if (sendEmail.status) {
          return res.status(201).json({
            message:
              "User registered successfully. Please activate your account",
            data: true,
          });
        } else {
          return res.status(500).json({
            message: "error in sending email",
            data: false,
          });
        }
      } else {
        return res.status(500).json({
          message: folderResult.message || "Error creating default folder",
          data: false,
        });
      }
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
    const passwordsMatch = await comparyePassword(password, user.password);
    if (!passwordsMatch) {
      return res
        .status(400)
        .json({ message: "Invalid credentials", data: false });
    }
    return res
      .status(200)
      .json({ message: "Login successful", data: { token } });
  } catch (error) {
    res.status(500).json({ message: error, data: false });
  }
};

const sendResetPassword = async (req, res) => {
  try {
    const { id } = req.body;
    const user = await User.findOne({ id });

    if (!user) {
      return res.status(404).json({ message: "User not found", data: false });
    }

    const resetPassToken = generateToken({ userId: id }, "1d");

    const sendEmail = await sendConfirmationEmail(
      user.fullname,
      user.email,
      resetPassToken
    );

    if (sendEmail.status) {
      return res.status(201).json({
        message: "Reset password link sent successfully",
        data: true,
      });
    } else {
      return res.status(500).json({
        message: "Error in sending email",
        data: false,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message, data: false });
  }
};

const getResetPassword = async (req, res) => {
  try {
    const token = req.params.token;

    try {
      const decodedToken = verifyToken(token);

      if (!decodedToken || !decodedToken.userId) {
        return res
          .status(400)
          .json({ message: "Invalid or expired token", data: false });
      }

      const userId = decodedToken.userId;
      const user = await User.findOne({ _id: userId });

      if (!user) {
        return res.status(404).json({ message: "User not found", data: false });
      }

      return res.status(200).json({ message: "Token is correct", data: true });
    } catch (verificationError) {
      if (verificationError.name === "JsonWebTokenError") {
        return res
          .status(400)
          .json({ message: "Invalid token format", data: false });
      }
      throw verificationError;
    }
  } catch (error) {
    res.status(500).json({ message: error.message, data: false });
  }
};

const confirmEmail = async (req, res) => {
  try {
    const token = req.params.token;
    const decodedToken = verifyToken(token);

    if (!decodedToken || !decodedToken.userId) {
      return res
        .status(400)
        .json({ message: "Invalid or expired token", data: false });
    }

    const userId = decodedToken.userId;
    await User.findByIdAndUpdate(userId, { isConfirmed: true });

    return res
      .status(200)
      .json({ message: "Account successfully confirmed", data: true });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error confirming account", data: false });
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

    const updatedUser = await User.findOneAndUpdate(
      { id },
      {
        fullname,
        password,
        email,
        isChanged: true,
      },
      { new: true }
    );

    if (!updatedUser) {
      return res
        .status(404)
        .json({ message: "the user didn't found", data: false });
    }

    return res
      .status(200)
      .json({ message: "user successfully changed", data: true });
  } catch (error) {
    res.status(500).json({ message: error, data: false });
  }
};

module.exports = {
  getUser,
  registerUser,
  loginUser,
  sendResetPassword,
  getResetPassword,
  confirmEmail,
  changeUser,
  // uploadProfileImage,
};
