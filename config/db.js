require("dotenv").config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB,
     process.env.USER,
      process.env.PASSWORD, 
      {
 host: process.env.HOST,
  dialect: process.env.DIALECT,
});

module.exports = sequelize;
