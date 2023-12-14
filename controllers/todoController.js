const Todo = require("../models/ToDo");
const Note = require("../models/Note");

// Get todo by ID
const getTodoById = async (req, res) => {
  const todoId = req.params.id;

  try {
    const todo = await Todo.findById(todoId);

    if (!todo) {
      return res
        .status(404)
        .json({ message: "The todo wasn't found", data: null });
    }
    res.status(200).json({ message: "Successful", data: todo });
  } catch (error) {
    res
      .status(500)
      .json({ message: `there is an error : ${error.message}`, data: null });
  }
};

// Get all todos
const getAllTodos = async (req, res) => {
  try {
    const todos = await Todo.find();

    if (todos != null && todos.length > 0) {
      res.status(200).json({ message: "Successful", data: todos });
    } else {
      return res.status(404).json({ message: "There is no todo", data: null });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: `there is an error : ${error.message}`, data: null });
  }
};

// Create a new todo
const createTodo = async (req, res) => {
  try {
    const { title, noteId, isCompleted } = req.body;

    const note = await Note.findById(noteId);

    if (!note) {
      return res
        .status(404)
        .json({ message: "The note wasn't found", data: null });
    }

    const todo = new Todo({ title, noteId, isCompleted });
    await todo.save();

    // Update the Note with the new todoId
    await Note.findByIdAndUpdate(noteId, { $push: { todos: todo._id } });

    res.status(201).json({ message: "Successful", data: todo });
  } catch (error) {
    res
      .status(500)
      .json({ message: `there is an error : ${error.message}`, data: null });
  }
};

// Update an existing todo by ID
const updateTodo = async (req, res) => {
  try {
    const { title, noteId, isCompleted } = req.body;

    const note = await Note.findById(noteId);

    if (!note) {
      return res
        .status(404)
        .json({ message: "The note wasn't found", data: null });
    }

    const todoId = req.params.id;
    const updatedTodo = await Todo.findByIdAndUpdate(
      todoId,
      { title, noteId, isCompleted },
      { new: true }
    );

    if (!updatedTodo) {
      return res
        .status(404)
        .json({ message: "the todo wasn't found", data: null });
    }
    res.status(200).json(updatedTodo);
  } catch (error) {
    res
      .status(500)
      .json({ message: `there is an error: ${error}`, data: null });
  }
};

// Delete a todo by ID
const deleteTodo = async (req, res) => {
  try {
    const todoId = req.params.id;

    const deletedTodo = await Todo.findByIdAndDelete(todoId);

    if (!deletedTodo) {
      return resnull
        .status(404)
        .json({ message: "the todo wasn't found", data: null });
    }

    // Get all notes that contain this tag
    const notesWithTodo = await Note.find({ todos: todoId });

    // Remove the todo ID from the todos array in each note
    for (let note of notesWithTodo) {
      await Note.findByIdAndUpdate(note._id, {
        $pull: { todos: todoId },
      });
    }

    res.status(200).json({ message: "Successful", data: deletedTodo });
  } catch (error) {
    res
      .status(500)
      .json({ message: `there is and error : ${error}`, data: null });
  }
};

module.exports = {
  getAllTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  getTodoById,
};
