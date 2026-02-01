const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");


const Note = sequelize.define("Note", {
    userId: { type: DataTypes.INTEGER, allowNull: false },
    NoteId: { type: DataTypes.INTEGER, allowNull: false },
    Content: { type: DataTypes.STRING },
    LeftNote: { type: DataTypes.INTEGER, allowNull: true },
},
    {
        tableName: "Note",
        timestamps: true
    })

module.exports = { Note };    