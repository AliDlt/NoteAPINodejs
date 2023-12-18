const { Router } = require("express");

const noteController = require("../controllers/noteController");

const {
  validateNoteFields,
} = require("../middlewares/bodyValidationMiddleware");
const checkUserId = require("../middlewares/checkUserIdAndExistence");

const router = new Router();

router.get("/api/searchNote/:search", checkUserId, noteController.searchNote);
router.get("/api/getNote/:id", checkUserId, noteController.getNoteById);
router.get("/api/getallNotes", checkUserId, noteController.getAllNotes);
router.get(
  "/api/getNotesByFolderId/:id",
  checkUserId,
  noteController.getNotesByFolderId
);
router.post(
  "/api/addNote",
  checkUserId,
  validateNoteFields,
  noteController.createNote
);
router.put(
  "/api/updateNote/:id",
  checkUserId,
  validateNoteFields,
  noteController.updateNote
);
router.delete("/api/deleteNote/:id", checkUserId, noteController.deleteNote);

module.exports = router;
