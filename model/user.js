const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const User = sequelize.define('user',{
    id:{
        autoIncrement: true,
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    name:{
        allowNull: false,
        type: Sequelize.STRING
    },
    email:{
        allowNull: false,
        type: Sequelize.STRING
    },
    password:{
        allowNull: false,
        type: Sequelize.STRING
    },
    isPremium: Sequelize.BOOLEAN
})

module.exports=User;