const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");


const Note = sequelize.define("Note", {
NoteId: {type: DataTypes.INTEGER},
Content: {type: DataTypes.STRING},
LeftNote: {type: DataTypes.INTEGER, defaultValue: 10 },
},
{
    tableName:"Note",
    timestamps:true
})

module.exports = Note;