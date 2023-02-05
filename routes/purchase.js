const express = require('express');
const router = express.Router();

const userAuthenticate = require('../middleware/setUser');
const premiumController = require('../controller/purchase')

router.get('/getPremium', userAuthenticate.authenticate,premiumController.buyPremium);
router.post('/updateStatus', userAuthenticate.authenticate, premiumController.updateStatus);

module.exports = router;