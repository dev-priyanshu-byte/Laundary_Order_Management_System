const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, (req, res) => {
  res.json({ data: [] });
});

router.post('/', authMiddleware, (req, res) => {
  res.status(201).json({ data: req.body });
});

module.exports = router;
