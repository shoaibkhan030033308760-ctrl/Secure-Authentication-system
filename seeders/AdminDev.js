require("dotenv").config();
const sodium = require("libsodium-wrappers-sumo");
const { User } = require("../model/user");

async function create() {
    await sodium.ready;

    const user = await User.findOne({ where: { email: process.env.EMAIL } });
    const password = "test1234";

    if (!user) {
        await User.create({
            name: "Test",
            email: process.env.EMAIL,
            password: password,
            isVerified: true
        });
        console.log("User created successfully.");
    } else {
        console.log("User already exists.");
    }
}

module.exports = { create };
