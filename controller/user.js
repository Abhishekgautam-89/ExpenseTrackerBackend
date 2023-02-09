const User = require('../model/user')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const addUser = (req,res,next)=>{
    const userName = req.body.userName;
    const userEmail= req.body.userEmail;
    const userPassword = req.body.userPassword;
    const salt= 10;
    
    // console.log(userPassword);
    try{    
        bcrypt.hash(userPassword, salt, async(err, hash)=>{
            console.log(err);
            // throw new Error(err)
            console.log('hash>>>',hash);
            const [user, created] = await User.findOrCreate({
                where:{email: userEmail},
                defaults:{
                    name: userName,
                    email:userEmail,
                    password: hash
                }
            });
            if(created){
                res.status(201).json({userExist: false})
            }
            else
            res.status(201).json({userExist:true})
        })    
        
        
    }
    catch(e){
        console.error(e);
    }
}

const loginUser = async(req, res, next)=>{
    const email= req.body.userEmail;
    const password = req.body.userPassword;
    
    try{
        const user = await User.findAll({where:{email: email}});
        
        if(user.length>0){
         bcrypt.compare(password, user[0].password, (err, result)=>{
            if(err){
                throw new Error('something went wrong')
            }
            if(result===true){ 
                res.status(201).json({userExist: true, login: true, token: generateToken(user[0].id, user[0].name, user[0].isPremium)})
                }
            else{
             return res.status(401).json({userExist: true, login:false})
            }
         })           
        }
        else{ 
        return res.status(404).json({userExist:false});
        }
        // console.log(user[0].dataValues.password);
        
    }
    catch(err){
        console.log(err);
        res.status(500).json({err});
    }
    
}

 const generateToken=(id, name, isPremium)=>{
   return jwt.sign({userId: id, userName: name, isPremium: isPremium}, process.env.PRIVATE_KEY)
}
module.exports={
    loginUser,
    addUser,
    generateToken
};