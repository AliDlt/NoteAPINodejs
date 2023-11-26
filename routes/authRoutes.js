const { Router } = require("express");

const authController = require("../controllers/authController");
const upload = require("../utils/uploadImage");

const router = new Router();

router.post("/api/register", authController.registerUser);
router.post("/api/login", authController.loginUser);
router.post("/api/reset-password", authController.resetPassword);
router.post("/api/confirm-email", authController.confirmEmail);
router.post("/api/change-user", authController.changeUser);
// router.post(
//   "/api/uploadProfile/:id",
//   upload.uploadConfig,
//   authController.uploadProfileImage
// );

module.exports = router;
