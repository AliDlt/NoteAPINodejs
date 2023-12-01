const User = require("../models/User");

const uploadImage = require("../utils/uploadImage");
const { generateToken } = require("../utils/jwt");
const { sendConfirmationEmail } = require("../utils/nodemailer");

const registerUser = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json("کاربری با این ایمیل از قبل وجود دارد.");
    }
    const confirmationToken = generateToken({ email });
    await User.create({ fullname, email, password });
    await sendConfirmationEmail(userEmail, confirmationToken);
    return res
      .status(201)
      .json("User registered successfully.Please active your account");
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json("User not found");
    }
    if (user.password !== password) {
      return res.status(400).json("Invalid credentials");
    }
    return res.status(200).json("Login successful");
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const resetPassword = async (req, res) => {
  try {
    const { _id, password } = req.body;
    const user = await User.findOne({ _id });
    if (!user) {
      return res.status(404).json("User not found");
    }

    await User.findOneAndUpdate({ _id }, { password }, { new: true });

    return res.status(201).json("User successfully changed password");
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const confirmEmail = async (req, res) => {
  try {
    const { _id } = req.body;
    const user = await User.findOne({ _id });
    if (!user) {
      return res.status(404).json("User not found");
    }

    await User.findOneAndUpdate({ _id }, { isConfirmed: true }, { new: true });

    return res.status(201).json("account successfully confirmed");
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
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
    const { _id, fullname, password, email } = req.body;
    const user = await User.findOne({ _id });
    if (!user) {
      return res.status(404).json("User not found");
    }

    if (req.file) {
      const { originalname, buffer } = req.file;
      const path = uploadImage(originalname, buffer);
      await User.findOneAndUpdate(
        { _id },
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
        { _id },
        { fullname, password, email },
        { new: true }
      );
    }

    return res.status(201).json("user successfully changed");
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
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
