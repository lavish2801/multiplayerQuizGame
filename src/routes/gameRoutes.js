const express = require("express");
const gameController = require("../controllers/gameController");
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post("/start", authMiddleware, gameController.startGame);
router.post('/submit-answer', authMiddleware, gameController.submitAnswer);
router.post('/close-sessions', gameController.closeAllSessions);

module.exports = router;