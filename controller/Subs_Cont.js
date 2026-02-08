const {User} = require("../model/user");
const { Subscription } = require("../model/Subscription");
const Stripe = require("stripe");
// const { where } = require("sequelize");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY)

async function customer(req, reply) {
    try {
    const {email} = req.body
const user = await User.findOne({where: {email}, 
include: {
    model: Subscription
}
})

if (!user) {
    return reply.code(401).send ({message: "user not found"})
}

const customer = await stripe.customers.create({
    email
})

await Subscription.update({
stripeId:customer.id,
},
{
where: {userId: user.id}
}
)

await user.save()

return reply.code(200).send({customer_id: customer.id})
    } catch(err) {
        return reply.code(500).send ({message: err.message})
    }
}

async function pay_intent(req, reply) {
 const {email, customer_id, plan} = req.body;

 try{
if(!["pro", "premium"].includes(plan) ) {
    return reply.code(400).send ({message: "only pro premium"})
}

 const user = await User.findOne({
    where: {email},
    include: Subscription,
})



if(!user || user.Subscription.stripeId !== customer_id) {
    return reply.code(400).send ({message:"message user or coustumer not found"})
}

const price = plan === "pro" ? 1000 : 500 ;

const paymentintent = await stripe.paymentIntents.create({
   amount: price,  
customer:customer_id,
currency: "usd",
metadata: {
    email,
    plan
}
})

return reply.code(200).send({
    client_secret: paymentintent.client_secret,
    paymentintentId : paymentintent.id
})

}catch(err){
    return reply.code(500).send({error : err.message})
}

}

module.exports = {customer, pay_intent}