const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { requireAuth } = require('../middleware/authMiddleware');

router.use(requireAuth);

router.get('/options', (req, res) => {
  const userId = req.session.userId;

  const platforms = db.prepare(`
    SELECT DISTINCT platform FROM games WHERE user_id = ?
  `).all(userId).map(r => r.platform);

  const genres = db.prepare(`
    SELECT DISTINCT genre FROM games WHERE user_id = ?
  `).all(userId).map(r => r.genre);

  res.json({ platforms, genres });
});

module.exports = router;
