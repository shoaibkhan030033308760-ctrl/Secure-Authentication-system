const swagger = require('@fastify/swagger');
const swaggerUI = require('@fastify/swagger-ui');
const fp = require('fastify-plugin');

async function swaggerPlugin(fastify, options) {

  await fastify.register(swagger, {
    mode: 'dynamic',
    openapi: {
      info: {
        title: 'Fastify API',
        description: 'Swagger is working 😎',
        version: '1.0.0'
      }
    }
  });



  await fastify.register(swaggerUI, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list'
    },
   
  });
}

module.exports = fp(swaggerPlugin);
