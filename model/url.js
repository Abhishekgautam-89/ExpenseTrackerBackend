const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const URL_List = sequelize.define('urlList',{
    id:{
        allowNull: false,
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    url:{
        type: Sequelize.STRING,
        allowNull: false
    }
})

module.exports = URL_List;