const sodium = require('libsodium-wrappers-sumo')
const { User } = require('../model/user');
const { Note } = require("../model/Notes");

async function noteUpload(req, reply) {
    const user = req.user;
    const { content } = req.body;
    if (!content) {
        return reply.code(401).send({ MailMessage: "write something" });
    }
    const lastNote = await Note.findOne({
        where: { userId: user.id },
        order: [["NoteId", "DESC"]],
    });
    const newNoteid = lastNote ? lastNote.NoteId + 1 : 1;
    await Note.create({
        Content: content,
        userId: user.id,
        NoteId: newNoteid,
    });
    return reply.code(200).send({ message: "content saved" });
}
async function getnote(req, reply) {
    try{
    const note = await Note.findOne({ where: { userId: req.user.id } });
    if (!note) {
        return reply.code(404).send({ NoteContent: "not found" });
    }else if(note){
    return reply.code(200).send({message: note.Content });
    }
}catch(err) {
    return reply.code(500).send({error: err.message})
}
}
module.exports = { noteUpload, getnote };
