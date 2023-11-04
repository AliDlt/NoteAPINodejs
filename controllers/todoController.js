const Todo = require("../models/ToDo");

// Get todo by ID
const getTodoById = async (req, res) => {
  const todoId = req.params.id;

  try {
    const todo = await Todo.findById(todoId);

    if (!todo) {
      return res.status(404).json({ message: "تودو پیدا نشد" });
    }
    res.status(200).json(todo);
  } catch (error) {
    res.status(500).json({ message: `خطایی به وجود آمد: ${error.message}` });
  }
};

// Get all todos
const getAllTodos = async (req, res) => {
  try {
    const todos = await Todo.find();

    if (todos != null && todos.length > 0) {
      res.json(todos);
    } else {
      res.json("هیچ تودویی وجود ندارد.");
    }
  } catch (error) {
    res.status(500).json({ message: `خطایی به وجود آمد: ${error.message}` });
  }
};

// Create a new todo
const createTodo = async (req, res) => {
  try {
    const { title, notes } = req.body;
    const todo = new Todo({ title, notes });
    await todo.save();
    res.json("تودو با موفقیت افزوده شد.");
  } catch (error) {
    res.status(500).json({ message: `خطایی به وجود آمد: ${error.message}` });
  }
};

// Update an existing todo by ID
const updateTodo = async (req, res) => {
  try {
    const { title, notes } = req.body;
    const todoId = req.body.id;
    const updatedTodo = await Todo.findByIdAndUpdate(
      todoId,
      { title, notes },
      { new: true }
    );

    if (!updatedTodo) {
      return res.status(404).json({ message: "تودو پیدا نشد" });
    }
    res.json("تودو با موفقیت آپدیت شد.");
  } catch (error) {
    res.status(500).json(`خطایی به وجود آمده است: ${error}`);
  }
};

// Delete a todo by ID
const deleteTodo = async (req, res) => {
  try {
    const todoId = req.body.id;

    const deletedTodo = await Note.findByIdAndDelete(todoId);

    if (!deletedTodo) {
      return res.status(404).json({ message: "تودو پیدا نشد" });
    }

    res.json({ message: "تودو با موفقیت حذف شد." });
  } catch (error) {
    res.status(500).json(`خطایی به وجود آمده است: ${error}`);
  }
};

module.exports = {
  getAllTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  getTodoById,
};
