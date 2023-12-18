const { Router } = require("express");

const folderController = require("../controllers/folderController");

const checkUserId = require("../middlewares/checkUserIdAndExistence");
const {
  validateFolderFields,
} = require("../middlewares/bodyValidationMiddleware");

const router = new Router();

//Get all folders of user
router.get("/api/getallFolders", checkUserId, folderController.getAllFolders);
//Add a new folder
router.post(
  "/api/addFolder",
  checkUserId,
  validateFolderFields,
  folderController.createFolder
);
//Get folder by id
router.get("/api/getFolder/:id", folderController.getFolderById);
//Get folder detail by id
router.get(
  "/api/getDetailFolder/:id",
  folderController.getDetailFolder
);
//Get default folder
router.get(
  "/api/getDefaultFolder",
  checkUserId,
  folderController.getDefaultFolder
);
//Update folder
router.put(
  "/api/updateFolder/:id",
  validateFolderFields,
  checkUserId,
  folderController.updateFolder
);
//Delete folder
router.delete(
  "/api/deleteFolder/:id",
  checkUserId,
  folderController.deleteFolder
);

module.exports = router;
