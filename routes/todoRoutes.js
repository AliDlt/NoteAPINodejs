const { Router } = require("express");

const todoController = require("../controllers/todoController");

const router = new Router();

router.get("/api/getallTodos", todoController.getAllTodos);
router.post("/api/addTodo", todoController.createTodo);
router.put("/api/updateTodo", todoController.updateTodo);
router.delete("/api/deleteTodo", todoController.deleteTodo);

module.exports = router;
