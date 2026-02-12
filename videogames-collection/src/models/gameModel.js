const db = require('../config/db');

function createGame(userId, { title, platform, genre, status }) {
  const stmt = db.prepare(`
    INSERT INTO games (user_id, title, platform, genre, status)
    VALUES (?, ?, ?, ?, ?)
  `);
  const info = stmt.run(userId, title, platform, genre, status);
  return info.lastInsertRowid;
}

function getGamesByUser(userId, filters = {}) {
  let query = `SELECT * FROM games WHERE user_id = ?`;
  const params = [userId];

  if (filters.platform) {
    query += ` AND platform = ?`;
    params.push(filters.platform);
  }
  if (filters.genre) {
    query += ` AND genre = ?`;
    params.push(filters.genre);
  }
  if (filters.status) {
    query += ` AND status = ?`;
    params.push(filters.status);
  }

  const stmt = db.prepare(query);
  return stmt.all(...params);
}

function getGameById(id, userId) {
  const stmt = db.prepare(`
    SELECT * FROM games WHERE id = ? AND user_id = ?
  `);
  return stmt.get(id, userId);
}

function updateGame(id, userId, data) {
  const stmt = db.prepare(`
    UPDATE games
    SET title = ?, platform = ?, genre = ?, status = ?
    WHERE id = ? AND user_id = ?
  `);
  const info = stmt.run(
    data.title,
    data.platform,
    data.genre,
    data.status,
    id,
    userId
  );
  return info.changes > 0;
}

function deleteGame(id, userId) {
  const stmt = db.prepare(`
    DELETE FROM games WHERE id = ? AND user_id = ?
  `);
  const info = stmt.run(id, userId);
  return info.changes > 0;
}

module.exports = {
  createGame,
  getGamesByUser,
  getGameById,
  updateGame,
  deleteGame
};
