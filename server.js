const fastify = require('fastify')({ logger: true });
const sequelize = require('./config/db');
const authroutes = require('./routes/authRoutes2');
const swaggerPlugin = require('./plugins/swagger');
async function startServer() {
  try {
    await sequelize.sync({force: true});
    console.log("Tables created and connected");
    await fastify.register(require("@fastify/rate-limit"));
    await fastify.register(require("@fastify/helmet"))
    await fastify.register(swaggerPlugin);
    await fastify.register(authroutes, { prefix: '/auth'});
    await fastify.printRoutes()
   await fastify.listen({ port: 3000 });
    console.log(`Server running at http://localhost:3000`);
    console.log("Swagger at http://localhost:3000/docs");

  } catch (err) {
    console.error("Unable to start server:", err);
  }
}

startServer();