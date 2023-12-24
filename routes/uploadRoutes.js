const { Router } = require("express");

const uploadController = require("../controllers/uploadController");

const checkUserId = require("../middlewares/checkUserIdAndExistence");

const router = new Router();

/**
 * @swagger
 * tags:
 *   name: Upload
 *   description: Operations related to file uploads
 */

/**
 * @swagger
 * /api/uploadImage:
 *   post:
 *     summary: Upload an image
 *     tags: [Upload]
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *         description: Bearer token for authentication
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *             required:
 *               - image
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *       400:
 *         description: Bad Request - Invalid input
 *       401:
 *         description: Unauthorized - Invalid token
 */
router.post("/api/uploadImage", checkUserId, uploadController.uploadImage);

/**
 * @swagger
 * /api/getImage:
 *   post:
 *     summary: Get an image
 *     tags: [Upload]
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
 *               imageName:
 *                 type: string
 *             required:
 *               - imageName
 *     responses:
 *       200:
 *         description: Image retrieved successfully
 *       400:
 *         description: Bad Request - Invalid input
 *       401:
 *         description: Unauthorized - Invalid token
 *       404:
 *         description: Image not found
 */
router.post("/api/getImage", checkUserId, uploadController.getImage);

module.exports = router;
