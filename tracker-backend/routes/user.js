const express = require('express');
const { authenticate } = require('../middlewares/auth');

const router = express.Router();

router.get('/profile', authenticate, (req, res) => {
  res.json({username: req.user.username});
});

module.exports = router;