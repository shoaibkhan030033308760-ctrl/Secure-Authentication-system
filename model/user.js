const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const { Otp } = require("./Otp")
const { Note } = require("./Notes")

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  name:
  {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  role: {
    type: DataTypes.ENUM("admin", "dev", "user"),
    defaultValue: "user"
  },
  token: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  expireToken: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  failedLoginAttempts: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  isLocked: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  twoFactorEnabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
},
  { timestamps: true, });

User.hasMany(Otp, { foreignKey: "userId" })
Otp.belongsTo(User, { foreignKey: "userId" })

User.hasMany(Note, {foreignKey: "userId"})
Note.belongsTo(User, {foreignKey: "userId"})
module.exports = { User }
