const { Router } = require("express");

const folderController = require("../controllers/folderController");

const checkUserIdAndExistence = require("../middlewares/checkUserIdAndExistence");
const {
  validateFolderFields,
} = require("../middlewares/bodyValidationMiddleware");

const router = new Router();

//Get all folders of user
router.get(
  "/api/getallFolders",
  checkUserIdAndExistence,
  folderController.getAllFolders
);
//Add a new folder
router.post(
  "/api/addFolder",
  validateFolderFields,
  checkUserIdAndExistence,
  folderController.createFolder
);
//Get folder by id
router.get(
  "/api/getFolder/:id",
  checkUserIdAndExistence,
  folderController.getFolderById
);
//Get folder detail by id
router.get(
  "/api/getDetailFolder/:id",
  checkUserIdAndExistence,
  folderController.getDetailFolder
);
//Get default folder
router.get(
  "/api/getDefaultFolder",
  checkUserIdAndExistence,
  folderController.getDefaultFolder
);
//Update folder
router.put(
  "/api/updateFolder/:id",
  validateFolderFields,
  checkUserIdAndExistence,
  folderController.updateFolder
);
//Delete folder
router.delete(
  "/api/deleteFolder/:id",
  checkUserIdAndExistence,
  folderController.deleteFolder
);

module.exports = router;
