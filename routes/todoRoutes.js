const { Router } = require("express");

const todoController = require("../controllers/todoController");

const router = new Router();

router.get("/api/getTodo/:id", todoController.getTodoById);
router.get("/api/getallTodos", todoController.getAllTodos);
router.post("/api/addTodo", todoController.createTodo);
router.put("/api/updateTodo/:id", todoController.updateTodo);
router.delete("/api/deleteTodo/:id", todoController.deleteTodo);

module.exports = router;
