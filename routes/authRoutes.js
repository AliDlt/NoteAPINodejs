const { Router } = require("express");

const authController = require("../controllers/authController");

const validate = require("../middlewares/bodyValidationMiddleware");
const checkUserId = require("../middlewares/checkUserIdAndExistence");

const router = new Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication and related operations
 */

/**
 * @swagger
 * /api/getUser:
 *   get:
 *     summary: Get user information
 *     tags: [Authentication]
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *         description: Bearer token for authentication
 *     responses:
 *       200:
 *         description: Successful response
 *       401:
 *         description: Unauthorized - Invalid token
 *       404:
 *         description: User not found
 */
router.get("/api/getUser/", checkUserId, authController.getUser);

/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - username
 *               - password
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad Request - Invalid input
 */
router.post(
  "/api/register",
  validate.validateRegisterFields,
  authController.registerUser
);

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Log in to the system
 *     tags: [Authentication]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - username
 *               - password
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Unauthorized - Invalid credentials
 */
router.post(
  "/api/login",
  validate.validateLoginFields,
  authController.loginUser
);

/**
 * @swagger
 * /api/send-reset-password/:
 *   post:
 *     summary: Send reset password email
 *     tags: [Authentication]
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *         description: Bearer token for authentication
 *     responses:
 *       200:
 *         description: Reset password email sent successfully
 *       401:
 *         description: Unauthorized - Invalid token
 *       404:
 *         description: User not found
 */
router.post("/api/send-reset-password/", authController.sendResetPassword);

/**
 * @swagger
 * /api/get-reset-password/{token}:
 *   get:
 *     summary: Get reset password page
 *     tags: [Authentication]
 *     parameters:
 *       - in: path
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: Reset password token
 *     responses:
 *       200:
 *         description: Reset password page rendered successfully
 *       404:
 *         description: Invalid or expired reset password token
 */
router.get("/api/get-reset-password/:token", authController.getResetPassword);

/**
 * @swagger
 * /api/change-password/:
 *   post:
 *     summary: Change user password
 *     tags: [Authentication]
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *         description: Bearer token for authentication
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newPassword:
 *                 type: string
 *             required:
 *               - newPassword
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       401:
 *         description: Unauthorized - Invalid token
 *       404:
 *         description: User not found
 *       400:
 *         description: Bad Request - Invalid input
 */
router.post(
  "/api/change-password/",
  checkUserId,
  validate.validateChangePasswordFields,
  authController.changePassword
);

/**
 * @swagger
 * /api/confirm-email/{token}:
 *   get:
 *     summary: Confirm user email
 *     tags: [Authentication]
 *     parameters:
 *       - in: path
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: Email confirmation token
 *     responses:
 *       200:
 *         description: Email confirmed successfully
 *       404:
 *         description: Invalid or expired email confirmation token
 */
router.get("/api/confirm-email/:token", authController.confirmEmail);

/**
 * @swagger
 * /api/change-user:
 *   post:
 *     summary: Change user details
 *     tags: [Authentication]
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *         description: Bearer token for authentication
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newUsername:
 *                 type: string
 *             required:
 *               - newUsername
 *     responses:
 *       200:
 *         description: User details changed successfully
 *       401:
 *         description: Unauthorized - Invalid token
 *       404:
 *         description: User not found
 *       400:
 *         description: Bad Request - Invalid input
 */
router.post(
  "/api/change-user",
  checkUserId,
  validate.validateChangeUserFields,
  authController.changeUser
);

module.exports = router;
