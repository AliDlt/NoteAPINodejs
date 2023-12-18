const { Router } = require("express");

const tagController = require("../controllers/tagController");

const {
  validateTagFields,
} = require("../middlewares/bodyValidationMiddleware");
const checkUserId = require("../middlewares/checkUserIdAndExistence");

const router = new Router();

router.get("/api/getTag/:id", checkUserId, tagController.getTagById);
router.get("/api/getallTags", checkUserId, tagController.getAllTags);
router.post(
  "/api/addTag",
  checkUserId,
  validateTagFields,
  tagController.createTag
);
router.put(
  "/api/updateTag/:id",
  checkUserId,
  validateTagFields,
  tagController.updateTag
);
router.delete("/api/deleteTag/:id", checkUserId, tagController.deleteTag);

module.exports = router;
