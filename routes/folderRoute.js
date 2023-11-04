const { Router } = require("express");

const folderController = require("../controllers/folderController");

const router = new Router();

router.get("/api/getFolder/:id", folderController.getFolderById);
router.get("/api/getallFolders", folderController.getAllFolders);
router.post("/api/addFolder", folderController.createFolder);
router.put("/api/updateFolder", folderController.updateFolder);
router.delete("/api/deleteFolder", folderController.deleteFolder);

module.exports = router;
