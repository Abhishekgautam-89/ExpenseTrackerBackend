const Users = require('../model/user');
const Expenses = require('../model/expense');
const sequelize = require('../util/database');


const showLeaderboard = async (req, res)=>{
    try{
        // console.log(req.user);
        // const expenses = await Expenses.findAll();
        
        const userLeaderBoardDetails = await Users.findAll({
            attributes: ['id', 'name', [sequelize.fn('sum', sequelize.col('expenses.expense')), 'total_expense']],
            include:[
                {
                    model: Expenses,
                    attribute:[]
                }
            ],
            group: ['user.id'],
            order: [['total_expense', 'DESC']]
        });
        
        res.status(201).json({expense: userLeaderBoardDetails})
    }
    catch(err){
        console.log(err);
        res.status(501).json(err);
    }

} 

module.exports={showLeaderboard};