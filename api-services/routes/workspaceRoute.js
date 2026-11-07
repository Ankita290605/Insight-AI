const express = require("express");
const workspaceController = require("../controllers/workspaceController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/add",authMiddleware,workspaceController.addWorkspace);

router.post("/remove",authMiddleware,workspaceController.removeWorkspace);

module.exports = router;