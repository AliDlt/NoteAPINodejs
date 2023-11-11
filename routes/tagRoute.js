const { Router } = require("express");

const tagController = require("../controllers/tagController");

const router = new Router();

router.get("/api/getTag/:id", tagController.getTagById);
router.get("/api/getallTags", tagController.getAllTags);
router.post("/api/addTag", tagController.createTag);
router.put("/api/updateTag/:id", tagController.updateTag);
router.delete("/api/deleteTag/:id", tagController.deleteTag);

module.exports = router;
