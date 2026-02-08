require("dotenv").config();
const sodium = require("libsodium-wrappers-sumo");
const { User } = require("../model/user");

async function create() {
    await sodium.ready;

    const user = await User.findOne({ where: { email: process.env.EMAIL_ADMIN } });
    const password = process.env.ADMIN_PASSWORD;

    if (!user) {
        await User.create({
            name: "Admin",
            email: process.env.EMAIL_ADMIN,
            password: password,
            isVerified: true,
            role: admin,
        });
        console.log("User created successfully.");
    } else {
        console.log("User already exists.");
    }
}

module.exports = { create };
