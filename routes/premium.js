const express = require('express');
const router = express.Router();
const premiumFeature = require('../controller/premium');
const authenticateUser = require('../middleware/setUser')


router.get('/showLeaderboard',authenticateUser.authenticate, premiumFeature.showLeaderboard)


module.exports = router;