const { Router } = require("express");

const authController = require("../controllers/authController");

const validate = require("../middlewares/bodyValidationMiddleware");
const checkUserId = require("../middlewares/checkUserIdAndExistence");

const router = new Router();

router.get("/api/getUser/", checkUserId, authController.getUser);
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
router.post(
  "/api/send-reset-password/",
  checkUserId,
  authController.sendResetPassword
);
router.get("/api/get-reset-password/:token", authController.getResetPassword);
router.post(
  "/api/change-password/",
  checkUserId,
  validate.validateChangePasswordFields,
  authController.changePassword
);
router.get("/api/confirm-email/:token", authController.confirmEmail);
router.post(
  "/api/change-user",
  checkUserId,
  validate.validateChangeUserFields,
  authController.changeUser
);

module.exports = router;
