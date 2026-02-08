const {customer, pay_intent} = require("../controller/Subs_Cont")


async function subs(fastify) {
    fastify.post("/customer", customer);
    fastify.post("/pay-details", pay_intent)
}

module.exports = subs;