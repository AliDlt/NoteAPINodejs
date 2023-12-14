const User = require("../models/User");

const checkUserIdAndExistence = async (req, res, next) => {
  const userId = req.body.userId;
  if (userId == null || userId == undefined) {
    return res
      .status(400)
      .json({ message: "the userId is required", data: null });
  }
  try {
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ message: "the user not found", data: null });
    }
    req.user = user;

    next();
  } catch (error) {
    res
      .status(500)
      .json({ message: `there is an error: ${error.message}`, data: null });
  }
};

module.exports = checkUserIdAndExistence;
