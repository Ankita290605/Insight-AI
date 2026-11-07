const express = require("express");
const workspaceMemberController = require("../controllers/workspaceMemberController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/add",authMiddleware,workspaceMemberController.addMember);

router.post("/remove",authMiddleware,workspaceMemberController.removeMember);

router.post("/update",authMiddleware,workspaceMemberController.updateMember);

module.exports = router;