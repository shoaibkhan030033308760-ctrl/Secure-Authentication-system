const fastify = require('fastify')({ logger: true });
const sequelize = require('./config/db');
const authroutes = require('./routes/authRoutes');
const swaggerPlugin = require('./plugins/swagger');
async function startServer() {
  try {
    await sequelize.sync({force: true});
    console.log("Tables created and connected");
    await fastify.register(require("@fastify/rate-limit"));
    await fastify.register(require("@fastify/helmet"))
    await fastify.register(require('@fastify/cors'),{ origin:"*"})
  //   await fastify.register(require('@fastify/cors'), {
  // origin: ["http://localhost:3000"],
  // methods: ["GET", "POST", "PUT", "DELETE"],
  // credentials: true,
  // });
    await fastify.register(swaggerPlugin);
    await fastify.register(authroutes, { prefix: '/auth',});
   addreas = await fastify.listen({ port: 3000 });
    console.log(`Server running at ${addreas}`);
    console.log("Swagger at http://localhost:3000/docs");

  } catch (err) {
    console.error("Unable to start server:", err);
  }
}

startServer();