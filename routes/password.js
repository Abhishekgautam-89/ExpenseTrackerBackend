const Express = require('express');
const router = Express.Router();
const resetPasswordController = require('../controller/forgotPassword');

router.use('/forgotpassword', resetPasswordController.forgotPassword);
router.get('/resetpassword/:id', resetPasswordController.checkUser);
router.get('/update-password/:id', resetPasswordController.setNewPassword)

module.exports = router;