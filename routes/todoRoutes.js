const { Router } = require("express");

const todoController = require("../controllers/todoController");

const {
  validateTodoFields,
} = require("../middlewares/bodyValidationMiddleware");
const checkUserId = require("../middlewares/checkUserIdAndExistence");

const router = new Router();

router.get("/api/getTodo/:id", checkUserId, todoController.getTodoById);
router.get("/api/getallTodos", checkUserId, todoController.getAllTodos);
router.post(
  "/api/addTodo",
  checkUserId,
  validateTodoFields,
  todoController.createTodo
);
router.put(
  "/api/updateTodo/:id",
  checkUserId,
  validateTodoFields,
  todoController.updateTodo
);
router.delete("/api/deleteTodo/:id", checkUserId, todoController.deleteTodo);

module.exports = router;
