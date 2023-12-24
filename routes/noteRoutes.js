const { Router } = require("express");

const noteController = require("../controllers/noteController");

const {
  validateNoteFields,
} = require("../middlewares/bodyValidationMiddleware");
const checkUserId = require("../middlewares/checkUserIdAndExistence");

const router = new Router();

/**
 * @swagger
 * tags:
 *   name: Notes
 *   description: Operations related to user notes
 */

/**
 * @swagger
 * /api/searchNote/{search}:
 *   get:
 *     summary: Search notes based on a keyword
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: search
 *         schema:
 *           type: string
 *         required: true
 *         description: Keyword to search for in notes
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
router.get("/api/searchNote/:search", checkUserId, noteController.searchNote);

/**
 * @swagger
 * /api/getNote/{id}:
 *   get:
 *     summary: Get note by ID
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Note ID
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
 *         description: Note not found
 */
router.get("/api/getNote/:id", checkUserId, noteController.getNoteById);

/**
 * @swagger
 * /api/getallNotes:
 *   get:
 *     summary: Get all notes of a user
 *     tags: [Notes]
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
router.get("/api/getallNotes", checkUserId, noteController.getAllNotes);

/**
 * @swagger
 * /api/getNotesByFolderId/{id}:
 *   get:
 *     summary: Get notes by folder ID
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Folder ID
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
 *         description: Folder not found
 */
router.get(
  "/api/getNotesByFolderId/:id",
  checkUserId,
  noteController.getNotesByFolderId
);

/**
 * @swagger
 * /api/addNote:
 *   post:
 *     summary: Add a new note
 *     tags: [Notes]
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
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *             required:
 *               - title
 *               - content
 *     responses:
 *       201:
 *         description: Note created successfully
 *       400:
 *         description: Bad Request - Invalid input
 *       401:
 *         description: Unauthorized - Invalid token
 */
router.post(
  "/api/addNote",
  checkUserId,
  validateNoteFields,
  noteController.createNote
);

/**
 * @swagger
 * /api/updateNote/{id}:
 *   put:
 *     summary: Update note by ID
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Note ID
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
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *             required:
 *               - title
 *               - content
 *     responses:
 *       200:
 *         description: Note updated successfully
 *       400:
 *         description: Bad Request - Invalid input
 *       401:
 *         description: Unauthorized - Invalid token
 *       404:
 *         description: Note not found
 */
router.put(
  "/api/updateNote/:id",
  checkUserId,
  validateNoteFields,
  noteController.updateNote
);

/**
 * @swagger
 * /api/deleteNote/{id}:
 *   delete:
 *     summary: Delete note by ID
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Note ID
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *         description: Bearer token for authentication
 *     responses:
 *       200:
 *         description: Note deleted successfully
 *       401:
 *         description: Unauthorized - Invalid token
 *       404:
 *         description: Note not found
 */
router.delete("/api/deleteNote/:id", checkUserId, noteController.deleteNote);

module.exports = router;
