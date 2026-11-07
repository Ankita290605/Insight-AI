const express = require("express");
const questionController = require("../controllers/questionController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/ask/:id",authMiddleware,questionController.askQuestion);

module.exports = router;