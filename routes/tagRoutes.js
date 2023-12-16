const { Router } = require("express");

const tagController = require("../controllers/tagController");

const {
  validateTagFields,
} = require("../middlewares/bodyValidationMiddleware");

const router = new Router();

router.get("/api/getTag/:id", tagController.getTagById);
// router.get("/api/getallTags", tagController.getAllTags);
router.post("/api/addTag", validateTagFields, tagController.createTag);
router.put("/api/updateTag/:id", validateTagFields, tagController.updateTag);
router.delete("/api/deleteTag/:id", tagController.deleteTag);

module.exports = router;
