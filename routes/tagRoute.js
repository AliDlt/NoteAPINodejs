const { Router } = require("express");

const tagController = require("../controllers/tagController");

const router = new Router();

router.get("/api/getTag/:id", tagController.getNoteById);
router.get("/api/getallTags", tagController.getAllNotes);
router.post("/api/addTag", tagController.createNote);
router.put("/api/updateTag", tagController.updateNote);
router.delete("/api/deleteTag", tagController.deleteNote);

module.exports = router;
