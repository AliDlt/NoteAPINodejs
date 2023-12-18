const { Router } = require("express");

const uploadController = require("../controllers/uploadController");

const checkUserId = require("../middlewares/checkUserIdAndExistence");

const router = new Router();

router.post("/api/uploadImage", checkUserId, uploadController.uploadImage);
router.post("/api/getImage", checkUserId, uploadController.getImage);

module.exports = router;
