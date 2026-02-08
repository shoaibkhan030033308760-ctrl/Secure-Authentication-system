const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const { User } = require("./user");

const Note = sequelize.define("Note",
  {
    userId:{type: DataTypes.INTEGER, allowNull: false},
    noteid: {type: DataTypes.INTEGER, allowNull: false},
    content: { type: DataTypes.TEXT, allowNull: false },
  },
  { tableName: "notes", timestamps: true }
);

module.exports = { Note };
