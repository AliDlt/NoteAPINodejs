const { Router } = require("express");

const authController = require("../controllers/authController");
const upload = require("../utils/uploadImage");

const router = new Router();

router.get("/api/getUser/:id", authController.getUser);
router.post("/api/register", authController.registerUser);
router.post("/api/login", authController.loginUser);
router.post("/api/reset-password", authController.resetPassword);
router.get("/api/confirm-email/:token", authController.confirmEmail);
router.post("/api/change-user", authController.changeUser);

// router.post(
//   "/api/uploadProfile/:id",
//   upload.uploadConfig,
//   authController.uploadProfileImage
// );

module.exports = router;
