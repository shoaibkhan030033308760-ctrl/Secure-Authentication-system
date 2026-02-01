const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Otp = sequelize.define("Otp",
    {
        userId: {
            type: DataTypes.INTEGER,allowNull: false,  },
        Otpcode: { type: DataTypes.INTEGER, allowNull: true, },
        expireAt: { type: DataTypes.DATE, allowNull: true, },
        purpose: { type: DataTypes.ENUM("register", "forgot", "login"), allowNull: false, },
    },
    {
        timestamps: true,
    }
);

module.exports = { Otp };