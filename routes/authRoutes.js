const { Router } = require("express");

const authController = require("../controllers/authController");

const validate = require("../middlewares/bodyValidationMiddleware");

const router = new Router();

router.get("/api/getUser/:id", authController.getUser);
router.post(
  "/api/register",
  validate.validateRegisterFields,
  authController.registerUser
);
router.post(
  "/api/login",
  validate.validateLoginFields,
  authController.loginUser
);
router.post("/api/send-reset-password/", authController.sendResetPassword);
router.get("/api/get-reset-password/:token", authController.getResetPassword);
router.post(
  "/api/change-password/",
  validate.validateChangePasswordFields,
  authController.changePassword
);
router.get("/api/confirm-email/:token", authController.confirmEmail);
router.post(
  "/api/change-user",
  validate.validateChangeUserFields,
  authController.changeUser
);

module.exports = router;
