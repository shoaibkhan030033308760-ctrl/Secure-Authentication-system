const { sendOtp, register, login, resetPassword, verifyLoginOtp } = require('../controller/authController');

async function authroutes(fastify, options) {
  fastify.post('/sendOtp', {
    config: {
      rateLimit: { max: 3, timeWindow: "10 second" },
    },
    schema: {
      tags: ['Authentication Routes'],
      summary: 'Send OTP to email',
      body: {
        type: 'object',
        required: ['email', 'purpose'],
        properties: {
          email: { type: 'string', format: 'email' },
          purpose: { type: 'string' },
        },
      },
      response: {
        200: { type: 'object', properties: { message: { type: 'string' } } },
        400: { type: 'object', properties: { message: { type: 'string' } } },
        401: { type: 'object', properties: { message: { type: 'string' } } },
        404: { type: 'object', properties: { message: { type: 'string' } } },
        429: { type: 'object', properties: { message: { type: 'string' } } },
      },
    },
  }, sendOtp);
  fastify.post('/register', {
    config: {
      rateLimit: { max: 3, timeWindow: "10 second" },
    },
    schema: {
      tags: ['Authentication Routes'],
      summary: 'Register a new user with OTP verification',
      body: {
        type: 'object',
        required: ['name', 'email', 'password', 'otp', 'twoFactorEnabled'],
        properties: {
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          password: { type: 'string' },
          otp: { type: 'string' },
          twoFactorEnabled: { type: 'string' } 
        }
      },
      response: {
        201: { type: 'object', properties: { message: { type: 'string' }, userId: { type: 'number' } } },
        400: { type: 'object', properties: { message: { type: 'string' }, error: { type: 'string' } } },
        500: { type: 'object', properties: { message: { type: 'string' } } },
      },
    },
  }, register);


  fastify.post('/login', {
    config: { rateLimit: { max: 2, timeWindow: "10 second" } },
    schema: {
      tags: ['Authentication Routes'],
      summary: 'User login with optional 2FA OTP',
      body: { type: 'object', required: ['email', 'password'], properties: { email: { type: 'string', format: 'email' }, password: { type: 'string' } } },
      response: {
        200: { type: 'object', properties: { message: { type: 'string' }, token: { type: 'string' } } },
        401: { type: 'object', properties: { message: { type: 'string' } } },
        404: { type: 'object', properties: { message: { type: 'string' } } },
        501: { type: 'object', properties: { message: { type: 'string' } } },
      },
    },
 }, login);

  fastify.post('/verify-login-otp', {
    config: { rateLimit: { max: 4, timeWindow: "10 second" } },
    schema: {
      tags: ['Authentication Routes'],
      summary: 'Verify OTP sent for login',
      body: { type: 'object', required: ['email', 'otp'], properties: { email: { type: 'string', format: 'email' }, otp: { type: 'string' } } },
      response: {
        200: { type: 'object', properties: { message: { type: 'string' }, token: { type: 'string' } } },
        400: { type: 'object', properties: { message: { type: 'string' } } },
        500: { type: 'object', properties: { message: { type: 'string' } } },
      },
    },
  }, verifyLoginOtp);

  fastify.post('/reset-password', {
    config: { rateLimit: { max: 5, timeWindow: "10 second" } },
    schema: {
      tags: ['Authentication Routes'],
      summary: 'Reset user password using OTP',
      body: { type: 'object', required: ['email', 'newPassword', 'otp', 'twoFactorEnabled'], properties: { email: { type: 'string', format: 'email' }, newPassword: { type: 'string' }, otp: { type: 'string' }, twoFactorEnabled: { type: 'string' } } },
      response: {
        200: { type: 'object', properties: { message: { type: 'string' } } },
        400: { type: 'object', properties: { message: { type: 'string' }, error: { type: 'string' } } },
        401: { type: 'object', properties: { message: { type: 'string' } } },
        404: { type: 'object', properties: { message: { type: 'string' } } },
        501: { type: 'object', properties: { message: { type: 'string' } } },
      },
    },
  }, resetPassword);
}

module.exports = authroutes