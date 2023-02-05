// const dotenv = require('dotenv');
// dotenv.config();

const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD,{
    dialect:'mysql',
    host:process.env.DB_HOST
})
// console.log(process.env.DB_NAME);

module.exports=sequelize;