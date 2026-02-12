const gameModel = require('../models/gameModel');

function create(req, res) {
  const userId = req.session.userId;
  const { title, platform, genre, status } = req.body;

  if (!title || !platform || !genre || !status) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  const id = gameModel.createGame(userId, { title, platform, genre, status });
  res.status(201).json({ message: 'Videojuego añadido', id });
}

function list(req, res) {
  const userId = req.session.userId;
  const filters = {
    platform: req.query.platform,
    genre: req.query.genre,
    status: req.query.status
  };

  const games = gameModel.getGamesByUser(userId, filters);
  res.json(games);
}

function update(req, res) {
  const userId = req.session.userId;
  const gameId = req.params.id;

  const exists = gameModel.getGameById(gameId, userId);
  if (!exists) {
    return res.status(404).json({ error: 'Videojuego no encontrado' });
  }

  const success = gameModel.updateGame(gameId, userId, req.body);
  res.json({ updated: success });
}

function remove(req, res) {
  const userId = req.session.userId;
  const gameId = req.params.id;

  const success = gameModel.deleteGame(gameId, userId);
  if (!success) {
    return res.status(404).json({ error: 'Videojuego no encontrado' });
  }

  res.json({ deleted: true });
}

module.exports = {
  create,
  list,
  update,
  remove
};
