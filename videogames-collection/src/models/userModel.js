const db = require('../config/db');

function createUser(username, passwordHash) {
  const stmt = db.prepare(`
    INSERT INTO users (username, password_hash)
    VALUES (?, ?)
  `);
  const info = stmt.run(username, passwordHash);
  return info.lastInsertRowid;
}

function findByUsername(username) {
  const stmt = db.prepare(`
    SELECT * FROM users WHERE username = ?
  `);
  return stmt.get(username);
}

function findById(id) {
  const stmt = db.prepare(`
    SELECT * FROM users WHERE id = ?
  `);
  return stmt.get(id);
}

module.exports = {
  createUser,
  findByUsername,
  findById
};
