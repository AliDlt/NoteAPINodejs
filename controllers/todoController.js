const Todo = require("../models/ToDo");
const Note = require("../models/Note");

// Get todo by ID
const getTodoById = async (req, res) => {
  const userId = req.user._id;
  const todoId = req.params.id;

  try {
    const todo = await Todo.findById({ _id: todoId, userId });

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
    const userId = req.user._id;
    const todos = await Todo.find({ userId });

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
    const userId = req.user._id;
    const { title, noteId, isCompleted } = req.body;

    // Use a consistent naming convention for clarity
    const defaultIsCompleted = isCompleted !== undefined ? isCompleted : false;

    if (noteId) {
      const note = await Note.findById({ _id: noteId, userId });

      if (!note) {
        return res
          .status(404)
          .json({ message: "The note wasn't found", data: null });
      }
    }

    const todo = new Todo({
      title,
      noteId,
      isCompleted: defaultIsCompleted,
      userId,
    });
    await todo.save();

    if (noteId) {
      // Update the Note with the new todoId
      await Note.findByIdAndUpdate(noteId, { $push: { todos: todo._id } });
    }
    res.status(201).json({ message: "Successful", data: todo });
  } catch (error) {
    // Log the error details for better debugging
    console.error(`Error creating todo: ${error.message}`);
    res
      .status(500)
      .json({ message: `There is an error: ${error.message}`, data: null });
  }
};

// Update an existing todo by ID
const updateTodo = async (req, res) => {
  try {
    const userId = req.user._id;
    const { title, noteId, isCompleted } = req.body;

    // Use a consistent naming convention for clarity
    const defaultIsCompleted = isCompleted !== undefined ? isCompleted : false;

    if (noteId) {
      const note = await Note.findById({ _id: noteId, userId });

      if (!note) {
        return res
          .status(404)
          .json({ message: "The note wasn't found", data: null });
      }
    }

    const todoId = req.params.id;
    const updatedTodo = await Todo.findByIdAndUpdate(
      todoId,
      { title, noteId, isCompleted: defaultIsCompleted },
      { new: true }
    );

    if (!updatedTodo) {
      return res
        .status(404)
        .json({ message: "the todo wasn't found", data: null });
    }
    res.status(200).json({ message: "Successful", data: updatedTodo });
  } catch (error) {
    res
      .status(500)
      .json({ message: `there is an error: ${error}`, data: null });
  }
};

// Delete a todo by ID
const deleteTodo = async (req, res) => {
  try {
    const userId = req.user._id;
    const todoId = req.params.id;

    const deletedTodo = await Todo.findByIdAndDelete({ _id: todoId, userId });

    if (!deletedTodo) {
      return resnull
        .status(404)
        .json({ message: "the todo wasn't found", data: null });
    }

    // Get all notes that contain this tag
    const notesWithTodo = await Note.find({ todos: todoId });

    // Remove the todo ID from the todos array in each note
    for (let note of notesWithTodo) {
      const updateNoteResult = await Note.findByIdAndUpdate(note._id, {
        $pull: { todos: todoId },
      });
      if (!updateNoteResult) {
        // Handle the case where the note update was not successful
        return res
          .status(500)
          .json({ message: "Failed to update note", data: null });
      }
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
