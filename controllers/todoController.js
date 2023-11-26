const Todo = require("../models/ToDo");
const Note = require("../models/Note");

// Get todo by ID
const getTodoById = async (req, res) => {
  const todoId = req.params.id;

  try {
    const todo = await Todo.findById(todoId);

    if (!todo) {
      return res.json([]);
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
      return res.json([]);
    }
  } catch (error) {
    res.status(500).json({ message: `خطایی به وجود آمد: ${error.message}` });
  }
};

// Create a new todo
const createTodo = async (req, res) => {
  try {
    const { title, note, isCompleted } = req.body;
    const todo = new Todo({ title, note, isCompleted });
    await todo.save();
    res.json("تودو با موفقیت افزوده شد.");
  } catch (error) {
    res.status(500).json({ message: `خطایی به وجود آمد: ${error.message}` });
  }
};

// Update an existing todo by ID
const updateTodo = async (req, res) => {
  try {
    const { title, note, isCompleted } = req.body;
    const todoId = req.params.id;
    const updatedTodo = await Todo.findByIdAndUpdate(
      todoId,
      { title, note, isCompleted },
      { new: true }
    );

    if (!updatedTodo) {
      return res.json([]);
    }
    res.json("تودو با موفقیت آپدیت شد.");
  } catch (error) {
    res.status(500).json(`خطایی به وجود آمده است: ${error}`);
  }
};

// Delete a todo by ID
const deleteTodo = async (req, res) => {
  try {
    const todoId = req.params.id;

    const deletedTodo = await Todo.findByIdAndDelete(todoId);

    if (!deletedTodo) {
      return res.json([]);
    }

    // Get all notes that contain this tag
    const notesWithTodo = await Note.find({ todos: todoId });

    // Remove the todo ID from the todos array in each note
    for (let note of notesWithTodo) {
      await Note.findByIdAndUpdate(note._id, {
        $pull: { todos: todoId },
      });
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
