const express = require('express');
const router = express.Router();

router.post('/login', (req, res) => {
  const { username } = req.body;
  res.json({
    data: {
      user: { id: 'demo-user', username },
      token: 'demo-token',
    },
  });
});

router.post('/register', (req, res) => {
  res.status(201).json({ data: req.body });
});

module.exports = router;
