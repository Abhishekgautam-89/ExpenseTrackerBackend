const jwt = require('jsonwebtoken')
const User = require('../model/user');


exports.authenticate =async (req, res, next)=>{   
    try{
        const token = req.header('Authorization');
        // console.log("header-token>>>>>",token);
        const userObject =  jwt.verify(token, process.env.PRIVATE_KEY);
        // console.log("token>>>>>",userObject);
        const user=await User.findByPk(userObject.userId);
        req.user=user;
        next();
    }
    catch(err){
        console.log(err);
    }
}

