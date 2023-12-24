const { Router } = require("express");

const tagController = require("../controllers/tagController");

const {
  validateTagFields,
} = require("../middlewares/bodyValidationMiddleware");
const checkUserId = require("../middlewares/checkUserIdAndExistence");

const router = new Router();

/**
 * @swagger
 * tags:
 *   name: Tags
 *   description: Operations related to user tags
 */

/**
 * @swagger
 * /api/getTag/{id}:
 *   get:
 *     summary: Get tag by ID
 *     tags: [Tags]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Tag ID
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
 *         description: Tag not found
 */
router.get("/api/getTag/:id", checkUserId, tagController.getTagById);

/**
 * @swagger
 * /api/getallTags:
 *   get:
 *     summary: Get all tags of a user
 *     tags: [Tags]
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
 */
router.get("/api/getallTags", checkUserId, tagController.getAllTags);

/**
 * @swagger
 * /api/addTag:
 *   post:
 *     summary: Add a new tag
 *     tags: [Tags]
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
 *               tagName:
 *                 type: string
 *             required:
 *               - tagName
 *     responses:
 *       201:
 *         description: Tag created successfully
 *       400:
 *         description: Bad Request - Invalid input
 *       401:
 *         description: Unauthorized - Invalid token
 */
router.post(
  "/api/addTag",
  checkUserId,
  validateTagFields,
  tagController.createTag
);

/**
 * @swagger
 * /api/updateTag/{id}:
 *   put:
 *     summary: Update tag by ID
 *     tags: [Tags]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Tag ID
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
 *               tagName:
 *                 type: string
 *             required:
 *               - tagName
 *     responses:
 *       200:
 *         description: Tag updated successfully
 *       400:
 *         description: Bad Request - Invalid input
 *       401:
 *         description: Unauthorized - Invalid token
 *       404:
 *         description: Tag not found
 */
router.put(
  "/api/updateTag/:id",
  checkUserId,
  validateTagFields,
  tagController.updateTag
);

/**
 * @swagger
 * /api/deleteTag/{id}:
 *   delete:
 *     summary: Delete tag by ID
 *     tags: [Tags]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Tag ID
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *         description: Bearer token for authentication
 *     responses:
 *       200:
 *         description: Tag deleted successfully
 *       401:
 *         description: Unauthorized - Invalid token
 *       404:
 *         description: Tag not found
 */
router.delete("/api/deleteTag/:id", checkUserId, tagController.deleteTag);

module.exports = router;
