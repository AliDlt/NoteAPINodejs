const { Router } = require("express");

const noteController = require("../controllers/noteController");

const router = new Router();

router.get("/api/searchNote/:search", noteController.getNoteById);
router.get("/api/getNote/:id", noteController.getNoteById);
router.get("/api/getallNotes", noteController.getAllNotes);
router.post("/api/addNote", noteController.createNote);
router.put("/api/updateNote", noteController.updateNote);
router.delete("/api/deleteNote", noteController.deleteNote);

module.exports = router;
