// Function to check if a string is a valid ObjectId
function isValidObjectId(id) {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isPasswordValid(password) {
  try {
    const passwordRegex = /^(?=\S+$).{8,}$/;
    return passwordRegex.test(password);
  } catch (error) {
    return false;
  }
}

// Middleware to validate required fields in the request body
function validateNoteFields(req, res, next) {
  const { title, todos, folderId, tags } = req.body;

  if (!title || !folderId) {
    return res.status(400).json({
      message: "Title and folderId are required in the request body",
      data: null,
    });
  }

  if (!isValidObjectId(folderId)) {
    return res.status(400).json({
      message: "Invalid folderId in the request body",
      data: null,
    });
  }

  // Additional validation checks for specific fields if needed
  if (!Array.isArray(todos)) {
    return res.status(400).json({
      message: "Todos must be provided as an array in the request body",
      data: null,
    });
  }

  // Additional validation checks for specific fields if needed
  if (!Array.isArray(tags)) {
    return res.status(400).json({
      message: "Tags must be provided as an array in the request body",
      data: null,
    });
  }

  next();
}

// Middleware to validate required fields in the request body
function validateFolderFields(req, res, next) {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({
      message: "Title is required in the request body",
      data: null,
    });
  }

  next();
}

// Middleware to validate required fields in the request body
function validateTagFields(req, res, next) {
  const { title, noteId } = req.body;

  if (!title) {
    return res.status(400).json({
      message: "Title is required in the request body",
      data: null,
    });
  }

  if (noteId && !isValidObjectId(noteId)) {
    return res.status(400).json({
      message: "Invalid noteId in the request body",
      data: null,
    });
  }

  next();
}

// Middleware to validate required fields in the request body
function validateTodoFields(req, res, next) {
  const { title, noteId } = req.body;

  if (!title) {
    return res.status(400).json({
      message: "Title is required in the request body",
      data: null,
    });
  }

  if (noteId !== undefined && !noteId !== null) {
    if (!isValidObjectId(noteId)) {
      return res.status(400).json({
        message: "Invalid noteId in the request body",
        data: null,
      });
    }
  }

  next();
}

// Middleware to validate required fields in the request body
function validateRegisterFields(req, res, next) {
  const { fullname, email, password } = req.body;

  if (!fullname || !email || !password) {
    return res.status(400).json({
      message: "Fullname, email and password are required in the request body",
      data: null,
    });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({
      message: "The email address is not valid",
      data: null,
    });
  }

  if (!isPasswordValid(password)) {
    return res.status(400).json({
      message:
        "Please fill a valid password. It should be at least 8 characters long and not contain white spaces.",
      data: false,
    });
  }

  next();
}

// Middleware to validate required fields in the request body
function validateLoginFields(req, res, next) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required in the request body",
      data: null,
    });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({
      message: "The email address is not valid",
      data: null,
    });
  }

  next();
}

// Middleware to validate required fields in the request body
function validateChangePasswordFields(req, res, next) {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({
      message: "email and newPassword are required in the request body",
      data: null,
    });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({
      message: "The email address is not valid",
      data: null,
    });
  }

  next();
}

// Middleware to validate required fields in the request body
function validateChangeUserFields(req, res, next) {
  const { fullname, email } = req.body;

  if (!email || !fullname) {
    return res.status(400).json({
      message: "Email and fullname are required in the request body",
      data: null,
    });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({
      message: "The email address is not valid",
      data: null,
    });
  }

  next();
}

module.exports = {
  validateNoteFields,
  validateFolderFields,
  validateTagFields,
  validateTodoFields,
  validateRegisterFields,
  validateLoginFields,
  validateChangePasswordFields,
  validateChangeUserFields,
  isPasswordValid,
};
