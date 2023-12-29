const { Router } = require("express");

const folderController = require("../controllers/folderController");

const checkUserId = require("../middlewares/checkUserIdAndExistence");
const {
  validateFolderFields,
} = require("../middlewares/bodyValidationMiddleware");

const router = new Router();

/**
 * @swagger
 * tags:
 *   name: Folders
 *   description: Operations related to user folders
 */

/**
 * @swagger
 * /api/getallFolders:
 *   get:
 *     summary: Get all folders of a user
 *     tags: [Folders]
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
router.get("/api/getallFolders", checkUserId, folderController.getAllFolders);

/**
 * @swagger
 * /api/addFolder:
 *   post:
 *     summary: Add a new folder
 *     tags: [Folders]
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
 *               folderName:
 *                 type: string
 *             required:
 *               - folderName
 *     responses:
 *       201:
 *         description: Folder created successfully
 *       400:
 *         description: Bad Request - Invalid input
 *       401:
 *         description: Unauthorized - Invalid token
 */
router.post(
  "/api/addFolder",
  checkUserId,
  validateFolderFields,
  folderController.createFolder
);

/**
 * @swagger
 * /api/getFolder/{id}:
 *   get:
 *     summary: Get folder by ID
 *     tags: [Folders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Folder ID
 *     responses:
 *       200:
 *         description: Successful response
 *       404:
 *         description: Folder not found
 */
router.get("/api/getFolder/:id", checkUserId, folderController.getFolderById);

/**
 * @swagger
 * /api/getDetailFolder/{id}:
 *   get:
 *     summary: Get detailed folder information by ID
 *     tags: [Folders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Folder ID
 *     responses:
 *       200:
 *         description: Successful response
 *       404:
 *         description: Folder not found
 */
router.get(
  "/api/getDetailFolder/:id",
  checkUserId,
  folderController.getDetailFolder
);

/**
 * @swagger
 * /api/getDefaultFolder:
 *   get:
 *     summary: Get default folder of a user
 *     tags: [Folders]
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
 *         description: Default folder not found
 */
router.get(
  "/api/getDefaultFolder",
  checkUserId,
  folderController.getDefaultFolder
);

/**
 * @swagger
 * /api/updateFolder/{id}:
 *   put:
 *     summary: Update folder by ID
 *     tags: [Folders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Folder ID
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
 *               folderName:
 *                 type: string
 *             required:
 *               - folderName
 *     responses:
 *       200:
 *         description: Folder updated successfully
 *       400:
 *         description: Bad Request - Invalid input
 *       401:
 *         description: Unauthorized - Invalid token
 *       404:
 *         description: Folder not found
 */
router.put(
  "/api/updateFolder/:id",
  validateFolderFields,
  checkUserId,
  folderController.updateFolder
);

/**
 * @swagger
 * /api/deleteFolder/{id}:
 *   delete:
 *     summary: Delete folder by ID
 *     tags: [Folders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Folder ID
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *         description: Bearer token for authentication
 *     responses:
 *       200:
 *         description: Folder deleted successfully
 *       401:
 *         description: Unauthorized - Invalid token
 *       404:
 *         description: Folder not found
 */
router.delete(
  "/api/deleteFolder/:id",
  checkUserId,
  folderController.deleteFolder
);

module.exports = router;
