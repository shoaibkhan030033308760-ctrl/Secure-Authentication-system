//const fp = require("fastify-plugin")
const verify= require("../middelware/verifyToke");
const { noteUpload, getnote } = require("../controller/noteController");

async function noteRoutes(fastify) {
  fastify.post("/upload", {
    preHandler: verify,
    // config: {
    //   rateLimit: { max: 1, timeWindow: "20 second" },
    // },
    schema: {
      tags: ["Notes"],
      summary: "Upload a note (auth required)",

      body: {
        type: "object",
        required: ["content"],
        properties: {
          content: { type: "string" },
        },
      },

      response: {
        200: {
          type: "object",
          properties: {
            message: { type: "string" },
          },
        },
      },
    },
  }, noteUpload);


fastify.get("/Get/:id", {
  preHandler: verify,
  schema: {
    tags: ["Notes"],
    summary: "Get a note by ID (auth required)",

    params: {
      type: "object", // ✅ FIX HERE
      required: ["id"],
      properties: {
        id: { type: "integer" },
      },
    },

    response: {
      200: {
        type: "object",
        properties: {
          message: { type: "string" },
        },
      },
      404: {
        type: "object",
        properties: {
          NoteContent: { type: "string" },
        },
      },
    },
  },
}, getnote);


}

// async function noteRoutes (fastify) {
//     fastify.addHook("preHandler", verify)
//     fastify.post("/upload", noteUpload )
//}

module.exports = noteRoutes