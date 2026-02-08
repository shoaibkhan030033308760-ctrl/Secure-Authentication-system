const { Note } = require("../model/note");
const { encrypt, decrypt } = require("../utils/E&D_content");

async function createNote(req, reply) {
   const  user = req.user
  const { content } = req.body;

const lastnote = await Note.findOne({
    where: {userId: user.id},
order: [["noteid", "DESC"]]
})

const increase = lastnote ? lastnote.noteid + 1 : 1   

  if (!content) {
    return reply.code(400).send({ message: "Content required" });
  }

  const encrypted = encrypt(content);

  const note = await Note.create({ 
    content: encrypted,
     userId: user.id,
    noteid: increase
    });

  return reply.code(201).send({
    NoteId: note.noteid,
    content: decrypt(note.content),
    userId: user.id,
    createdAt: note.createdAt,
    updatedAt: note.updatedAt
  });
}

async function getNotes(req, reply) {
  let notes;

  if (req.user.role === "admin" || req.user.role === "dev") {
    notes = await Note.findAll({ order: [["id", "ASC"]] });
  } else {
    notes = await Note.findAll({ where: { userId: req.user.id }, order: [["id", "ASC"]] });
  }

  const decrypted = notes.map(n => ({
    id: n.id,
    content: decrypt(n.content),
    userId: n.userId,
    createdAt: n.createdAt,
    updatedAt: n.updatedAt
  }));

  return reply.code(200).send(decrypted);
}

// Get single note by ID (role-based)
async function getNoteById(req, reply) {
  const note = await Note.findByPk(req.params.id);

  if (!note) return reply.code(404).send({ message: "Note not found" });

  if (req.user.role === "user" && note.userId !== req.user.id) {
    return reply.code(403).send({ message: "Forbidden" });
  }

  return reply.code(200).send({
    id: note.id,
    content: decrypt(note.content),
    userId: note.userId,
    createdAt: note.createdAt,
    updatedAt: note.updatedAt
  });
}


async function updateNote(req, reply) {
  const note = await Note.findByPk(req.params.id);

  if (!note) return reply.code(404).send({ message: "Note not found" });

  if (req.user.role === "user" && note.userId !== req.user.id) {
    return reply.code(403).send({ message: "Forbidden" });
  }

  const { content } = req.body;
  if (!content) return reply.code(400).send({ message: "Content required" });

  note.content = encrypt(content);
  await note.save();

  return reply.code(200).send({ message: "Note updated successfully" });
}

// Delete note (role-based)
async function deleteNote(req, reply) {
  const note = await Note.findByPk(req.params.id);

  if (!note) return reply.code(404).send({ message: "Note not found" });

  if (req.user.role === "user" && note.userId !== req.user.id) {
    return reply.code(403).send({ message: "Forbidden" });
  }

  await note.destroy();
  return reply.code(200).send({ message: "Note deleted successfully" });
}
module.exports = { 
  createNote,
   getNotes, 
   getNoteById, 
   updateNote,
    deleteNote
  };
