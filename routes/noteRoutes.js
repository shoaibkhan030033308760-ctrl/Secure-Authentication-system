const verify= require("../middelware/verifyToke");
const {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote
} = require("../controller/noteController");

async function authRoutes(fastify) {
fastify.post("/upload", { preHandler: verify }, createNote);
fastify.get("/get", { preHandler: verify }, getNotes);
fastify.get("/get/:id", { preHandler: verify }, getNoteById);
fastify.put("/update/:id", { preHandler: verify }, updateNote);
fastify.delete("/delete/:id", { preHandler: verify }, deleteNote);

}


module.exports = authRoutes