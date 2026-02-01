const swagger = require('@fastify/swagger');
const swaggerUI = require('@fastify/swagger-ui');
const fp = require('fastify-plugin');

async function swaggerPlugin(fastify, options) {
fastify.register(require('@fastify/swagger'), {
  routePrefix: '/docs',
  swagger: {
    info: {
      title: 'My API',
      description: 'API documentation',
      version: '1.0.0'
    },
    securityDefinitions: {
      BearerAuth: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header',
      }
    },
    security: [{ BearerAuth: [] }],
  },
  // exposeRoute: true,
});


const swaggerUI = require('@fastify/swagger-ui');

await fastify.register(swaggerUI, {
  routePrefix: '/docs',
  uiConfig: {
    docExpansion: 'list'
  },
});

}

module.exports = fp(swaggerPlugin);
