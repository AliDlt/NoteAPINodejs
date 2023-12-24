const { Router } = require("express");

const todoController = require("../controllers/todoController");

const {
  validateTodoFields,
} = require("../middlewares/bodyValidationMiddleware");
const checkUserId = require("../middlewares/checkUserIdAndExistence");

const router = new Router();

/**
 * @swagger
 * tags:
 *   name: Todos
 *   description: Operations related to user todos
 */

/**
 * @swagger
 * /api/getTodo/{id}:
 *   get:
 *     summary: Get todo by ID
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Todo ID
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *         description: Bearer token for authentication
 *     responses:
 *       200:
 *         description: Successful response
 *       401:
 *         description: Unauthorized - Invalid token
 *       404:
 *         description: Todo not found
 */
router.get("/api/getTodo/:id", checkUserId, todoController.getTodoById);

/**
 * @swagger
 * /api/getallTodos:
 *   get:
 *     summary: Get all todos of a user
 *     tags: [Todos]
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *         description: Bearer token for authentication
 *     responses:
 *       200:
 *         description: Successful response
 *       401:
 *         description: Unauthorized - Invalid token
 */
router.get("/api/getallTodos", checkUserId, todoController.getAllTodos);

/**
 * @swagger
 * /api/addTodo:
 *   post:
 *     summary: Add a new todo
 *     tags: [Todos]
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *         description: Bearer token for authentication
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               todoTitle:
 *                 type: string
 *               todoDescription:
 *                 type: string
 *               isCompleted:
 *                 type: boolean
 *             required:
 *               - todoTitle
 *     responses:
 *       201:
 *         description: Todo created successfully
 *       400:
 *         description: Bad Request - Invalid input
 *       401:
 *         description: Unauthorized - Invalid token
 */
router.post(
  "/api/addTodo",
  checkUserId,
  validateTodoFields,
  todoController.createTodo
);

/**
 * @swagger
 * /api/updateTodo/{id}:
 *   put:
 *     summary: Update todo by ID
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Todo ID
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *         description: Bearer token for authentication
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               todoTitle:
 *                 type: string
 *               todoDescription:
 *                 type: string
 *               isCompleted:
 *                 type: boolean
 *             required:
 *               - todoTitle
 *     responses:
 *       200:
 *         description: Todo updated successfully
 *       400:
 *         description: Bad Request - Invalid input
 *       401:
 *         description: Unauthorized - Invalid token
 *       404:
 *         description: Todo not found
 */
router.put(
  "/api/updateTodo/:id",
  checkUserId,
  validateTodoFields,
  todoController.updateTodo
);

/**
 * @swagger
 * /api/deleteTodo/{id}:
 *   delete:
 *     summary: Delete todo by ID
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Todo ID
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *         description: Bearer token for authentication
 *     responses:
 *       200:
 *         description: Todo deleted successfully
 *       401:
 *         description: Unauthorized - Invalid token
 *       404:
 *         description: Todo not found
 */
router.delete("/api/deleteTodo/:id", checkUserId, todoController.deleteTodo);

module.exports = router;
