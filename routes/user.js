const express = require('express');
const router = express.Router();

const user = require('../controller/user')

router.post('/user/signup',user.addUser)
router.post('/user/login', user.loginUser)


module.exports=router;