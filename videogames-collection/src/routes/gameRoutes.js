const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');
const { requireAuth } = require('../middleware/authMiddleware');

router.use(requireAuth);

router.post('/', gameController.create);
router.get('/', gameController.list);
router.put('/:id', gameController.update);
router.delete('/:id', gameController.remove);

module.exports = router;
