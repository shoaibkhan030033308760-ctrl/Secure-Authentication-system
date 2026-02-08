require("dotenv").config
const crypto = require("crypto");
const key = Buffer.from(process.env.CHACHA20_KEY, "hex");

function encrypt(text) {
  const iv = crypto.randomBytes(12);
  const algorithm = "chacha20-poly1305"
  const cipher = crypto.createCipheriv(
  algorithm, key, iv,
    { authTagLength: 16 });

  let encrypted = cipher.update(text,
    "utf8", "hex"
  );
  encrypted += cipher.final("hex");
  const tag = cipher.getAuthTag().toString("hex");
  return `${iv.toString("hex")}:${tag}:${encrypted}`;
}

function decrypt(enc) {
  const [ivHex, tagHex, encrypted] = enc.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const tag = Buffer.from(tagHex, "hex");
  const algorithm = "chacha20-poly1305";
  const decipher = crypto.createDecipheriv(
    algorithm, key, iv,
    { authTagLength: 16 });
  decipher.setAuthTag(tag);
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

module.exports = { encrypt, decrypt };
