const fastify = require('fastify')({ logger: true });
const sequelize = require('./config/db');
const authroutes = require('./routes/authRoutes');
const swaggerPlugin = require('./plugins/swagger');
const authRoutes = require("./routes/noteRoutes")
const payment = require("./routes/Subscription")


async function startServer() {
  try {
    await sequelize.sync({ alter: true });
    console.log("Tables created and connected");
    // await fastify.register(require("@fastify/cors"), {
    //   origin: ["http://192.168.0.101:4000"],
    //   methods: ["GET", "POST", "PUT", "DELETE"]
    // });
    await fastify.register(require("@fastify/cors"), {
      origin: "*"
    });
    await fastify.register(require("@fastify/rate-limit"));
    await fastify.register(require("@fastify/helmet"))
    await fastify.register(swaggerPlugin);
    await fastify.register(authroutes, { prefix: "/auth" });
    await fastify.register(authRoutes, { prefix: "/note" })
    await fastify.register(payment, { prefix: "/pay" })
    await fastify.ready()
    await console.log(fastify.printRoutes())
    await fastify.listen({ port: 3000 });
    console.log(`Server running at http://localhost:3000`);
    console.log("Swagger at http://localhost:3000/docs");

  } catch (err) {
    console.error("Unable to start server:", err);
  }
}

startServer();