const { Router } = require("express");

const folderController = require("../controllers/folderController");

const router = new Router();

router.get("/api/getallFolders", folderController.getAllFolders);
router.post("/api/addFolder", folderController.createFolder);
router.get("/api/getFolder/:id", folderController.getFolderById);
router.get("/api/getDetailFolder/:id", folderController.getDetailFolder);
router.put("/api/updateFolder/:id", folderController.updateFolder);
router.delete("/api/deleteFolder/:id", folderController.deleteFolder);

module.exports = router;
