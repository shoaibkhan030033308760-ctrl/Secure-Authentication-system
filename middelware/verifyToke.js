const {User} = require("../model/user")

async function verify(req, reply) {
const authheader = req.headers["authorization"]
if(!authheader) {
    return reply.code(401).send({message: "no token"})
}

const token = authheader.split(" ")[1];
const user = await User.findOne({where: {token}})
if(!user) {
    return reply.code(401).send({message: "invalid token"})
}
req.user = user;
}
module.exports = verify;
