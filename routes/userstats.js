const express = require("express");
const router = express.Router();
router.use(express.json());
const userstatsController = require('../controllers/userstats.js');

router.get('/1.0.0/gprank/:Username', userstatsController.gpRank);
router.get('/1.0.0/winsrank/:Username', userstatsController.winsRank);
router.get('/1.0.0/winperrank/:Username', userstatsController.winPercRank);
router.get('/1.0.0/leaderboard', userstatsController.leaderboard);

module.exports = router;