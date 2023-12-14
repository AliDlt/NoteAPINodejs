const { Router } = require("express");

const uploadController = require("../controllers/uploadController");

const router = new Router();

router.post("/api/uploadImage", uploadController.uploadImage);
router.post("/api/getImage", uploadController.getImage);

module.exports = router;
