const { Router } = require("express");

const noteController = require("../controllers/noteController");

const router = new Router();

router.get("/api/searchNote/:search", noteController.searchNote);
router.get("/api/getNote/:id", noteController.getNoteById);
router.get("/api/getallNotes", noteController.getAllNotes);
router.get("/api/getNotesByFolderId/:id", noteController.getNotesByFolderId);
router.post("/api/addNote", noteController.createNote);
router.put("/api/updateNote/:id", noteController.updateNote);
router.delete("/api/deleteNote/:id", noteController.deleteNote);

module.exports = router;
