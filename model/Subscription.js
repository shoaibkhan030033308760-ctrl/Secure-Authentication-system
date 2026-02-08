const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");
const {User} = require("./user");
const { defaultValueSchemable } = require("sequelize/lib/utils");

const Subscription = sequelize.define("Subscription", {
userId: {
    type: DataTypes.INTEGER, allowNull: false, defaultValue: 1,
},
plan: {
    type: DataTypes.ENUM("free", "pro", "admin"), defaultValue: "free",
},
stripeId :{
    type: DataTypes.STRING, allowNull: true,
},
isActive: {
    type: DataTypes.BOOLEAN, defaultValue: false,
},

})

module.exports = {Subscription};